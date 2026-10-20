import { test, expect, type APIRequestContext } from '@playwright/test';
import { isSeasonalRateLimitWindow } from '../support/madrid';
import { isProductionServer, isProductionTarget } from '../support/server';
import { uniqueIp } from '../support/ip';

const LIMIT = 30;
const MAX_RETRY_AFTER_SECONDS = 2400;
const SEASONAL_REASON = 'seasonal rate-limit window (17-24 January Europe/Madrid)';
const PRODUCTION_REASON =
  'requires a production build (set E2E_PRODUCTION=1 if E2E_BASE_URL points to one)';

// Invalid on purpose: the limiter runs before the validation, so every allowed request answers 400
const INVALID_BODY = { participant: 'x', schoolKey: '' };

function search(request: APIRequestContext, ip?: string) {
  return request.post('/api/participants', {
    headers: { accept: 'application/json', ...(ip ? { 'x-forwarded-for': ip } : {}) },
    data: INVALID_BODY,
  });
}

test.describe('participants rate limit', () => {
  test('blocks the 31st request of one address and leaves other addresses alone', async ({
    request,
  }) => {
    test.skip(isSeasonalRateLimitWindow(), SEASONAL_REASON);
    test.skip(!isProductionTarget(), PRODUCTION_REASON);
    // Probe the running server: a reused dev server on the port has no limiter
    test.skip(!(await isProductionServer(request)), 'requires a production build');
    const ip = uniqueIp();

    for (let attempt = 1; attempt <= LIMIT; attempt++) {
      const response = await search(request, ip);
      expect(response.status(), `request ${attempt}`).toBe(400);
    }

    const blocked = await search(request, ip);
    expect(blocked.status()).toBe(429);
    expect(await blocked.json()).toEqual({ error: 'Too many requests' });
    expect(blocked.headers()['cache-control']).toBe('no-store');
    const retryAfter = blocked.headers()['retry-after'];
    expect(retryAfter).toMatch(/^\d+$/);
    expect(Number(retryAfter)).toBeGreaterThanOrEqual(1);
    expect(Number(retryAfter)).toBeLessThanOrEqual(MAX_RETRY_AFTER_SECONDS);

    const other = await search(request, uniqueIp());
    expect(other.status()).toBe(400);
  });

  test('never limits requests without an x-forwarded-for header', async ({ request }) => {
    test.skip(isSeasonalRateLimitWindow(), SEASONAL_REASON);
    test.skip(!isProductionTarget(), PRODUCTION_REASON);
    test.skip(!(await isProductionServer(request)), 'requires a production build');

    // The server logs one error line the first time it sees a request without an address
    for (let attempt = 1; attempt <= 3; attempt++) {
      const response = await search(request);
      expect(response.status(), `request ${attempt}`).toBe(400);
    }
  });
});
