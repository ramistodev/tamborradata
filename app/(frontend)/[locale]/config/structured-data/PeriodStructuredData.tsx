import { periodKind } from '@/app/types/period.types';
import { GlobalStructuredData } from './period/GlobalStructuredData';
import type { PeriodStructuredDataProps } from './period/types';
import { YearStructuredData } from './period/YearStructuredData';

/** Picks the structured data that fits the period: one edition (year) or the full history. */
export function PeriodStructuredData(props: PeriodStructuredDataProps) {
  return props.stats.metaData.periodKind === periodKind.global ? (
    <GlobalStructuredData {...props} />
  ) : (
    <YearStructuredData {...props} />
  );
}
