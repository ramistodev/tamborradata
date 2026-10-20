import { describe, expect, it } from 'vitest';
import { formatNumber } from '@/app/(frontend)/[locale]/lib/format';

const compact = (value: number, locale?: string) =>
  new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short' }).format(value);

describe('formatNumber', () => {
  it.each([
    [0, '00'],
    [5, '05'],
    [9, '09'],
  ])('zero-pads %s to %s', (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });

  it('keeps 9.5 inside the padded range', () => {
    expect(formatNumber(9.5)).toBe('9.5');
  });

  it('does not pad negative numbers', () => {
    expect(formatNumber(-1, 'en')).toBe('-1');
  });

  it.each([
    [10, '10'],
    [999, '999'],
    [1234, '1.2K'],
    [1_500_000, '1.5M'],
  ])('formats %s as %s in en', (value, expected) => {
    expect(formatNumber(value, 'en')).toBe(expected);
  });

  describe.each(['es', 'eu', undefined])('locale %s', (locale) => {
    it.each([1234, 1_500_000])('uses the compact Intl format for %s', (value) => {
      expect(formatNumber(value, locale)).toBe(compact(value, locale));
    });
  });
});
