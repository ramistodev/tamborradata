import { describe, expect, it } from 'vitest';
import { wasModified } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/wasModified';

const published = '2025-02-01T10:00:00.000Z';

describe('wasModified', () => {
  it.each([
    { name: 'updated exactly 60,000 ms later', updated: '2025-02-01T10:01:00.000Z', expected: false },
    { name: 'updated 60,001 ms later', updated: '2025-02-01T10:01:00.001Z', expected: true },
    { name: 'updated one day later', updated: '2025-02-02T10:00:00.000Z', expected: true },
    { name: 'updated at the same instant', updated: published, expected: false },
    { name: 'updated before it was published', updated: '2025-01-31T10:00:00.000Z', expected: false },
  ])('returns $expected when $name', ({ updated, expected }) => {
    expect(wasModified(published, updated)).toBe(expected);
  });
});
