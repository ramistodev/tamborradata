import { describe, expect, it } from 'vitest';
import { isSubsequence } from '@/app/(backend)/api/participants/lib/isSubsequence';

describe('isSubsequence', () => {
  it.each([
    [[], [], true],
    [[], ['a'], true],
    [['a', 'c'], ['a', 'b', 'c'], true],
    [['c', 'a'], ['a', 'b', 'c'], false],
    [['a'], [], false],
    [['a', 'a'], ['a', 'b', 'a'], true],
    [['a', 'a'], ['a'], false],
    [['a', 'b'], ['a', 'b'], true],
    [['a', 'b'], ['a'], false],
  ])('needle %j in haystack %j is %s', (needle, haystack, expected) => {
    expect(isSubsequence(needle, haystack)).toBe(expected);
  });
});
