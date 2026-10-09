'use client';
import { useTranslations } from 'next-intl';
import type { RankCategory } from '../../../../../../../types/api/statistics.types';
import { RANK_PAGE_SIZE, useRank } from '../../hooks/useRank';
import { RankSkeleton } from './RankSkeleton';

const HIGHLIGHTED_POSITIONS = 3;
const MIN_BAR_WIDTH_PERCENT = 2;
const DASHED_BUTTON =
  'flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-transparent text-xs text-text-secondary font-mono transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60';

/** Horizontal ranking: position, label, a bar relative to the leader, and the value. */
export function RankRender({ category, unit = '' }: { category: RankCategory; unit?: string }) {
  const t = useTranslations('Statistics.layout');
  const {
    ranks,
    listRef,
    formatNumber,
    maxValue,
    hasMore,
    canCollapse,
    isLoading,
    loadMore,
    collapseRanks,
  } = useRank(category);

  if (ranks != null && ranks.length === 0) {
    return null;
  }

  return (
    <div ref={listRef} className="flex flex-col gap-2">
      <ol className="flex flex-col gap-1" aria-busy={isLoading}>
        {ranks.map((entry) => {
          const label = entry.entityLabel ?? entry.school?.canonicalName ?? '—';
          const isHighlighted = entry.rank <= HIGHLIGHTED_POSITIONS;
          const barWidth =
            maxValue > 0 ? Math.max(MIN_BAR_WIDTH_PERCENT, (entry.value / maxValue) * 100) : 0;

          return (
            <li
              key={`${entry.rank}-${entry.entityKey ?? entry.school?.schoolId ?? label}`}
              className="flex items-center justify-between gap-3 sm:gap-4 rounded-md px-1.5 py-1.5"
            >
              <span
                className={`w-4 shrink-0 text-right font-mono text-[10.5px] font-semibold ${
                  isHighlighted ? 'text-accent' : 'text-text-tertiary'
                }`}
              >
                {entry.rank}
              </span>
              <div className="flex-1">
                <p className="truncate text-[12.8px] leading-[1.35] text-text" title={label}>
                  {label}
                </p>
                <div className="mt-1.25 h-1 overflow-hidden rounded-full bg-bg-hover">
                  <div
                    className={`h-full rounded-full ${
                      isHighlighted ? 'bg-accent' : 'bg-accent-dim opacity-60'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span className="w-7 shrink-0 text-left font-mono text-xs font-semibold text-text-secondary">
                {formatNumber.format(entry.value)}
                {unit}
              </span>
            </li>
          );
        })}
        {isLoading && <RankSkeleton rows={RANK_PAGE_SIZE} />}
      </ol>
      {(hasMore || canCollapse) && (
        <div className="flex flex-col gap-2 justify-center">
          {canCollapse && (
            <button
              type="button"
              onClick={collapseRanks}
              disabled={isLoading}
              className={DASHED_BUTTON}
            >
              <span className="font-semibold">{t('showLess')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('top', { count: RANK_PAGE_SIZE })}</span>
            </button>
          )}
          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoading}
              aria-busy={isLoading}
              className={DASHED_BUTTON}
            >
              <span className="font-semibold">{t('showMore')}</span>
              <span aria-hidden="true">·</span>
              <span>
                {ranks.length + 1}-{ranks.length + RANK_PAGE_SIZE}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
