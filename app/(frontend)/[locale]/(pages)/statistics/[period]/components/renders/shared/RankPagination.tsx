import { useTranslations } from 'next-intl';
import { Icons } from '../../../../../../components/Icons';
import { RANK_PAGE_SIZE } from '../../../hooks/useRank';

const DASHED_BUTTON =
  'flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-transparent text-xs text-text-secondary font-mono transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60';

type RankPaginationProps = {
  /** Rows currently shown. */
  shown: number;
  hasMore: boolean;
  canCollapse: boolean;
  isLoading: boolean;
  /** The last "show more" request failed or timed out. */
  hasError: boolean;
  onLoadMore: () => void;
  onCollapse: () => void;
};

/** "Show more" / "Show less" buttons shared by every paginated ranking-like render. */
export function RankPagination({
  shown,
  hasMore,
  canCollapse,
  isLoading,
  hasError,
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
          {hasMore && hasError && !isLoading && (
            <div
              role="alert"
              className="flex justify-between items-center gap-x-3 gap-y-2 rounded-xl border border-border-danger bg-bg-danger px-3 py-2.5"
            >
              <Icons.ExclamationCircle className="size-4 text-text-danger" />
              <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 flex-1">
                <p className="min-w-0 flex-1 text-xs font-medium text-text">{t('loadError')}</p>
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border-danger bg-transparent px-3 font-mono text-xs font-semibold text-text-danger transition-colors hover:bg-bg-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icons.RetryIcon className="size-3.5" />
                  {t('retry')}
                </button>
              </div>
            </div>
          )}
          {hasMore && !(hasError && !isLoading) && (
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
