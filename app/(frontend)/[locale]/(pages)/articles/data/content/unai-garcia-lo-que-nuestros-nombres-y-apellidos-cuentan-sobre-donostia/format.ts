import type { Locale } from '@/app/types/locale';

export interface Formatter {
  int: (value: number) => string;
  percent: (value: number, digits?: number) => string;
}

export function createFormatter(locale: Locale): Formatter {
  return {
    int: (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value),
    percent: (value, digits = 1) =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value / 100),
  };
}
