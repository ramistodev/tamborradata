import { useTranslations } from 'next-intl';
import { RANK_PAGE_SIZE } from '../../../hooks/useRank';

const DASHED_BUTTON =
  'flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-transparent text-xs text-text-secondary font-mono transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60';

type RankPaginationProps = {
  /** Rows currently shown. */
  shown: number;
  hasMore: boolean;
  canCollapse: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onCollapse: () => void;
};

/** "Show more" / "Show less" buttons shared by every paginated ranking-like render. */
export function RankPagination({
  shown,
  hasMore,
  canCollapse,
  isLoading,
  onLoadMore,
  onCollapse,
}: RankPaginationProps) {
  const t = useTranslations('Statistics.layout');

  return (
    <>
      {/* Announces the new count when rows are added or removed. */}
      <p role="status" className="sr-only">
        {t('shown', { count: shown })}
      </p>
      {(hasMore || canCollapse) && (
        <div className="flex flex-col gap-2 justify-center">
          {canCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              disabled={isLoading}
              className={DASHED_BUTTON}
            >
              <span className="font-semibold">{t('showLess')}</span>
              <span aria-hidden="true">·</span>
              <span>1-{RANK_PAGE_SIZE}</span>
            </button>
          )}
          {hasMore && (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoading}
              aria-busy={isLoading}
              className={DASHED_BUTTON}
            >
              <span className="font-semibold">{t('showMore')}</span>
              <span aria-hidden="true">·</span>
              <span>
                {shown + 1}-{shown + RANK_PAGE_SIZE}
              </span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
