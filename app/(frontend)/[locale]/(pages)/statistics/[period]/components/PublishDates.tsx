import { useFormatter, useTranslations } from 'next-intl';
import { PeriodData } from '../../../../../../types/api/statistics.types';
import { wasModified } from '../utils/wasModified';

/** Shows a single date: when it was updated if it was modified after publishing, else when it was published. */
export function PublishDates({ periodData }: { periodData: PeriodData }) {
  const t = useTranslations('Statistics.publishDates');
  const format = useFormatter();

  const modified = wasModified(periodData.publishedAt, periodData.updatedAt);
  const isoDate = modified ? periodData.updatedAt : periodData.publishedAt;

  // Fixed time zone so server and client render the same string (no hydration mismatch)
  const date = format.dateTime(new Date(isoDate), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  });

  return (
    <time
      dateTime={isoDate}
      className="text-xs whitespace-nowrap sm:text-sm font-mono text-text-secondary"
    >
      {modified ? t('updated', { date }) : t('published', { date })}
    </time>
  );
}
