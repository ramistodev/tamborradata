import type { Locale } from '@/app/types/locale';

export interface Formatter {
  int: (value: number) => string;
  decimal: (value: number, digits?: number) => string;
  percent: (value: number, digits?: number) => string;
}

export function createFormatter(locale: Locale): Formatter {
  return {
    // `useGrouping: 'always'`: Spanish omits the separator in four-digit numbers (4012), but this
    // article writes thousands the same way in every language (4.012 / 4,012).
    int: (value) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: 'always' }).format(
        value
      ),
    decimal: (value, digits = 1) =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value),
    percent: (value, digits = 1) =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value / 100),
  };
}
