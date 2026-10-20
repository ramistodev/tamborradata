import { describe, expect, it } from 'vitest';
import { RateLimitedError } from '@/app/(frontend)/[locale]/lib/errors';

describe('RateLimitedError', () => {
  it('is an Error carrying the retry delay and a fixed message', () => {
    const error = new RateLimitedError(120);

    expect(error).toBeInstanceOf(Error);
    expect(error.retryAfterSeconds).toBe(120);
    expect(error.message).toBe('Rate limited');
  });

  it('exposes the delay as an own property', () => {
    expect(Object.keys(new RateLimitedError(30))).toContain('retryAfterSeconds');
  });
});
