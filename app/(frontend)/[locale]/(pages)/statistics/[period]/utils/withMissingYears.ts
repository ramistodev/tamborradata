import { PeriodResponse } from '../../../../../../types/api/period.types';

export type PeriodListItem =
  | { type: 'period'; period: PeriodResponse }
  | { type: 'missing'; year: number };

const YEAR_SLUG_REGEX = /^\d{4}$/;

/**
 * Inserts one `missing` item per year without an edition between two consecutive year periods
 * (e.g. 2020 → 2022 gives a gap for 2021). Non-year periods (global) are left untouched.
 */
export function withMissingYears(periods: PeriodResponse[]): PeriodListItem[] {
  const items: PeriodListItem[] = [];
  let previousYear: number | null = null;

  for (const period of periods) {
    const isYear = YEAR_SLUG_REGEX.test(period.publicSlug);
    const year = isYear ? Number(period.publicSlug) : null;

    if (year !== null && previousYear !== null) {
      const step = year > previousYear ? 1 : -1;
      for (let missingYear: number = previousYear + step; missingYear !== year; missingYear += step) {
        items.push({ type: 'missing', year: missingYear });
      }
    }

    items.push({ type: 'period', period });
    previousYear = year ?? previousYear;
  }

  return items;
}
