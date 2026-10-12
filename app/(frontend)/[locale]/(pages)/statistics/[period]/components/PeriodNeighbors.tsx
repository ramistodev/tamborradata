import { useTranslations } from 'next-intl';
import { Link } from '../../../../../i18n/navigation';
import type { PeriodResponse } from '../../../../../../types/api/period.types';
import { adjacentPeriods } from '../utils/adjacentPeriods';

type PeriodNeighborsProps = { periods: PeriodResponse[]; currentPeriod: string };

const CARD =
  'group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-5';
const KICKER =
  'flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-tertiary';

/**
 * Links to the edition before and after this one. It follows the direction the selector reads, so
 * newest comes first: the left card goes to a more recent year and the right one to an older year.
 */
export function PeriodNeighbors({ periods, currentPeriod }: PeriodNeighborsProps) {
  const t = useTranslations('Statistics.closing');
  const { newer, older } = adjacentPeriods(periods, currentPeriod);

  if (!newer && !older) {
    return null;
  }

  return (
    <nav aria-label={t('navLabel')} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {newer ? (
        <Link href={`/statistics/${newer.publicSlug}`} className={CARD}>
          <span className={KICKER}>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
            >
              ←
            </span>
            {t('newer')}
          </span>
          <span className="text-base font-semibold text-text sm:text-lg">
            {t('edition', { period: newer.publicSlug })}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {older && (
        <Link
          href={`/statistics/${older.publicSlug}`}
          className={`${CARD} sm:items-end sm:text-right`}
        >
          <span className={KICKER}>
            {t('older')}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </span>
          <span className="text-base font-semibold text-text sm:text-lg">
            {t('edition', { period: older.publicSlug })}
          </span>
        </Link>
      )}
    </nav>
  );
}
