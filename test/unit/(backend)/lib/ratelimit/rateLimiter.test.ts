import { afterEach, describe, expect, it, vi } from 'vitest';
import { importFresh } from '@/test/helpers/freshImport';
import { logMock } from '@/test/helpers/loggerMock';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());

const NOW = '2026-03-10T12:00:00.000Z';
const headers = (ip?: string) => new Headers(ip ? { 'x-forwarded-for': ip } : {});

async function load(now = NOW) {
  vi.useFakeTimers({ now: new Date(now) });
  const { checkRateLimit } = await importFresh(() => import('@/app/(backend)/lib/ratelimit/rateLimiter'));

  return checkRateLimit;
}

function exhaust(check: Awaited<ReturnType<typeof load>>, ip: string, calls = 30) {
  for (let i = 0; i < calls; i++) check(headers(ip));
}

describe('checkRateLimit', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('always allows in development without logging', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const check = await load();

    const results = Array.from({ length: 100 }, () => check(headers('203.0.113.7')));

    expect(results.every((result) => result.allow)).toBe(true);
    expect(check(headers())).toEqual({ allow: true });
    expect(logMock).not.toHaveBeenCalled();
  });

  describe('missing x-forwarded-for', () => {
    it('allows the request and reports the problem only once', async () => {
      const check = await load();

      expect(check(headers())).toEqual({ allow: true });
      expect(logMock).toHaveBeenCalledTimes(1);
      expect(logMock.mock.calls[0][0]).toContain('x-forwarded-for');
      expect(logMock.mock.calls[0][1]).toBe('error');

      expect(check(headers())).toEqual({ allow: true });
      expect(logMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('limit', () => {
    it('allows 30 calls and denies the 31st with the full window', async () => {
      const check = await load();

      for (let i = 1; i <= 30; i++) {
        expect(check(headers('203.0.113.7'))).toEqual({ allow: true });
      }

      expect(check(headers('203.0.113.7'))).toEqual({ allow: false, retryAfterSeconds: 2400 });
    });

    it('reports the remaining time as the clock advances', async () => {
      const check = await load();
      exhaust(check, '203.0.113.7');

      vi.advanceTimersByTime(100_000);

      expect(check(headers('203.0.113.7'))).toEqual({ allow: false, retryAfterSeconds: 2300 });
    });

    it('rounds the remaining time up', async () => {
      const check = await load();
      exhaust(check, '203.0.113.7');

      vi.advanceTimersByTime(500);

      expect(check(headers('203.0.113.7'))).toEqual({ allow: false, retryAfterSeconds: 2400 });
    });
  });

  describe('window expiry', () => {
    it('restarts the count once the window has elapsed', async () => {
      const check = await load();
      exhaust(check, '203.0.113.7');

      vi.advanceTimersByTime(2400 * 1000);

      expect(check(headers('203.0.113.7'))).toEqual({ allow: true });
      for (let i = 0; i < 29; i++) {
        expect(check(headers('203.0.113.7'))).toEqual({ allow: true });
      }
      expect(check(headers('203.0.113.7'))).toEqual({ allow: false, retryAfterSeconds: 2400 });
    });
  });

  describe('independent addresses', () => {
    it('does not share counters between IPs', async () => {
      const check = await load();
      exhaust(check, '203.0.113.1');

      expect(check(headers('203.0.113.2'))).toEqual({ allow: true });
      expect(check(headers('203.0.113.1')).allow).toBe(false);
    });
  });

  describe('seasonal window', () => {
    it('uses the short window around the Tamborrada', async () => {
      const check = await load('2026-01-20T12:00:00.000Z');
      exhaust(check, '203.0.113.7');

      expect(check(headers('203.0.113.7'))).toEqual({ allow: false, retryAfterSeconds: 60 });

      vi.advanceTimersByTime(60_000);

      expect(check(headers('203.0.113.7'))).toEqual({ allow: true });
    });
  });

  describe('privacy', () => {
    it('never returns or logs the raw address', async () => {
      const check = await load();
      const ip = '203.0.113.7';
      const results = Array.from({ length: 31 }, () => check(headers(ip)));

      for (const result of results) {
        expect(JSON.stringify(result)).not.toContain(ip);
      }
      expect(logMock).not.toHaveBeenCalled();
    });
  });

  describe('sweep', () => {
    it('forgets expired entries once the sweep interval has passed', async () => {
      const check = await load();
      check(headers('203.0.113.1'));

      vi.advanceTimersByTime(2401 * 1000);
      check(headers('203.0.113.2'));

      expect(check(headers('203.0.113.1'))).toEqual({ allow: true });
      for (let i = 0; i < 29; i++) {
        expect(check(headers('203.0.113.1'))).toEqual({ allow: true });
      }
      expect(check(headers('203.0.113.1')).allow).toBe(false);
    });
  });

  describe('capacity', () => {
    it(
      'evicts the oldest entry when more than 50,000 addresses are tracked',
      { timeout: 30_000 },
      async () => {
        const check = await load();
        exhaust(check, 'ip-0');
        expect(check(headers('ip-0')).allow).toBe(false);

        // 50,000 more distinct addresses make 50,001 in total, which pushes ip-0 out of the map
        for (let i = 1; i <= 50_000; i++) {
          expect(check(headers(`ip-${i}`))).toEqual({ allow: true });
        }

        expect(check(headers('ip-0'))).toEqual({ allow: true });

        // The most recent entry is still tracked: 1 call above plus 29 more, then denied
        expect(check(headers('ip-50000'))).toEqual({ allow: true });
        for (let i = 0; i < 28; i++) {
          expect(check(headers('ip-50000'))).toEqual({ allow: true });
        }
        expect(check(headers('ip-50000')).allow).toBe(false);
      }
    );
  });
});
