import { cache } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('react cache outside React Server Components', () => {
  it('returns a callable that forwards to the original function and does not memoize', () => {
    const fn = vi.fn((value: number) => value * 2);
    const cached = cache(fn);

    expect(cached(2)).toBe(4);
    expect(cached(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(2);
  });
});
