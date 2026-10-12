import type { PeriodResponse } from '@/app/types/api/period.types';
import type { StatisticsResponse } from '@/app/types/api/statistics.types';
import type { getFormatter, getTranslations } from 'next-intl/server';

export type StatisticsTranslator = Awaited<ReturnType<typeof getTranslations<'Statistics'>>>;
export type Formatter = Awaited<ReturnType<typeof getFormatter>>;

export type PeriodStructuredDataProps = {
  stats: StatisticsResponse;
  periods: PeriodResponse[];
};
