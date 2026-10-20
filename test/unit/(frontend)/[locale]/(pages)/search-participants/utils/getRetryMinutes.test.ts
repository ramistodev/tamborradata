import { describe, expect, it } from 'vitest';

import { getRetryMinutes } from '@/app/(frontend)/[locale]/(pages)/search-participants/utils/getRetryMinutes';

describe('getRetryMinutes', () => {
  it.each([
    [1, 1],
    [59, 1],
    [60, 1],
    [61, 2],
    [119, 2],
    [120, 2],
    [121, 3],
    [0.5, 1],
    [0, 1],
    [-5, 1],
    [NaN, 1],
    [Infinity, 1],
  ])('turns %s seconds into %s minute(s)', (seconds, minutes) => {
    expect(getRetryMinutes(seconds)).toBe(minutes);
  });
});
