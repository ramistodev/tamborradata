import { PeriodResponse } from '../../../../../types/api/period.types';
import { GLOBAL_STATS_KEY } from '../../../config/constants';

/** Global period first, then the rest in the order they come. */
export function sortPeriods(periods: PeriodResponse[]) {
  return [...periods].sort(
    (a, b) => Number(b.periodKey === GLOBAL_STATS_KEY) - Number(a.periodKey === GLOBAL_STATS_KEY)
  );
}
