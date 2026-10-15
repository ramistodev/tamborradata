import 'server-only';
import { createHmac } from 'node:crypto';
import { hashSecret, isDev } from '../../core/config/env';
import { log } from '../../core/logger';
import { getRateLimitRule } from './config';

export type RateLimitReturn = { allow: true } | { allow: false; retryAfterSeconds: number };

const SWEEP_INTERVAL_MS = 60_000;
// Hard cap so a flood of made-up addresses cannot grow the map without bound
const MAX_ENTRIES = 50_000;

// Lives as long as the server instance does: it is shared by every request that instance serves
const hits = new Map<string, { count: number; resetAt: number }>();
let lastSweep = Date.now();
let hasWarnedMissingIp = false;

// Keyed by a keyed hash, so the raw address never sits in memory
const maskIp = (ipAddress: string) =>
  createHmac('sha256', hashSecret).update(ipAddress).digest('hex');

// At most once per interval, so a busy server does not walk the whole map on every request
function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;

  lastSweep = now;
  for (const [key, { resetAt }] of hits) {
    if (resetAt <= now) hits.delete(key);
  }
}

// Once per instance, so a misconfigured proxy does not fill the log with one line per request
function warnMissingIp() {
  if (hasWarnedMissingIp) return;

  hasWarnedMissingIp = true;
  // Logged as an error because the logger drops every other level in production
  log("[rate-limit] No 'x-forwarded-for' header: requests are not being limited", 'error');
}

export function checkRateLimit(headers: Request['headers']): RateLimitReturn {
  if (isDev) return { allow: true };

  const ipAddress = headers.get('x-forwarded-for');

  // Without an address there is nothing to count by, and sharing one counter would lock everybody
  // out together, so the request goes through and the problem is reported instead
  if (!ipAddress) {
    warnMissingIp();
    return { allow: true };
  }

  const { max, windowSeconds } = getRateLimitRule();
  const now = Date.now();
  sweepExpired(now);

  const key = maskIp(ipAddress);
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });

    // A map keeps insertion order, so the first key is the oldest entry
    if (hits.size > MAX_ENTRIES) hits.delete(hits.keys().next().value!);

    return { allow: true };
  }

  if (entry.count >= max) {
    return { allow: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allow: true };
}
