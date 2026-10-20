import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRateLimitRule } from '@/app/(backend)/lib/ratelimit/config';

const DEFAULT_RULE = { max: 30, windowSeconds: 2400 };
const SEASONAL_RULE = { max: 30, windowSeconds: 60 };

describe('getRateLimitRule', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ['2026-01-16T22:59:59Z', DEFAULT_RULE],
    ['2026-01-16T23:00:00Z', SEASONAL_RULE],
    ['2026-01-20T12:00:00Z', SEASONAL_RULE],
    ['2026-01-24T22:59:59Z', SEASONAL_RULE],
    ['2026-01-24T23:00:00Z', DEFAULT_RULE],
    ['2026-07-15T12:00:00Z', DEFAULT_RULE],
    ['2025-01-20T12:00:00Z', SEASONAL_RULE],
    ['2027-01-20T12:00:00Z', SEASONAL_RULE],
    ['2026-12-31T12:00:00Z', DEFAULT_RULE],
  ])('resolves %s using the Madrid calendar day', (iso, expected) => {
    expect(getRateLimitRule(new Date(iso))).toEqual(expected);
  });

  describe('without arguments', () => {
    it('uses the seasonal rule on the Tamborrada', () => {
      vi.useFakeTimers({ now: new Date('2026-01-20T12:00:00Z') });

      expect(getRateLimitRule()).toEqual(SEASONAL_RULE);
    });

    it('uses the default rule outside the season', () => {
      vi.useFakeTimers({ now: new Date('2026-03-10T12:00:00Z') });

      expect(getRateLimitRule()).toEqual(DEFAULT_RULE);
    });
  });
});
