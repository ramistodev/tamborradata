import type { PeriodResponse } from '../../../../../../types/api/period.types';
import { periodKind } from '../../../../../../types/period.types';

/**
 * Editions right after (`newer`) and right before (`older`) `currentSlug`, `null` where the
 * timeline ends. Only years take part: the global period is not an edition next to another one,
 * and the period selector already links to it. The page reads newest first, like the selector.
 */
export function adjacentPeriods(periods: PeriodResponse[], currentSlug: string) {
  const years = periods
    .filter((period) => period.kind === periodKind.year)
    .sort((a, b) => Number(b.publicSlug) - Number(a.publicSlug));
  const index = years.findIndex((period) => period.publicSlug === currentSlug);

  if (index === -1) {
    return { newer: null, older: null };
  }

  return { newer: years[index - 1] ?? null, older: years[index + 1] ?? null };
}
