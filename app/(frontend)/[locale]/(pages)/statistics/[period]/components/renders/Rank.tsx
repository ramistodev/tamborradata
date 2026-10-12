'use client';
import { useTranslations } from 'next-intl';
import type { RankCategory } from '../../../../../../../types/api/statistics.types';
import { RANK_PAGE_SIZE, useRank } from '../../hooks/useRank';
import { DIVERGING_CATEGORIES } from '../../utils/divergingCategories';
import { RankPagination } from './shared/RankPagination';
import { DivergingValue, RankBar } from './RankBar';
import { RankSkeleton } from './RankSkeleton';

const HIGHLIGHTED_POSITIONS = 3;

/** Horizontal ranking: position, label, a bar relative to the leader, and the value. */
export function RankRender({ category, unit = '' }: { category: RankCategory; unit?: string }) {
  const {
    ranks,
    listRef,
    formatNumber,
    maxAbsValue,
    hasMore,
    canCollapse,
    isLoading,
    loadMore,
    collapseRanks,
  } = useRank(category);

  const tCategory = useTranslations('Statistics.categories');
  const isDiverging = DIVERGING_CATEGORIES.has(category.category);

  if (ranks != null && ranks.length === 0) {
    return null;
  }

  return (
    <div ref={listRef} className="flex flex-col gap-2">
      <ol
        aria-label={tCategory(`${category.category}.title`)}
        className="flex flex-col gap-1"
        aria-busy={isLoading}
      >
        {ranks.map((entry) => {
          const label = entry.entityLabel ?? entry.school?.canonicalName ?? '—';
          const isHighlighted = entry.rank <= HIGHLIGHTED_POSITIONS;

          return (
            <li
              key={`${entry.rank}-${entry.entityKey ?? entry.school?.schoolId ?? label}`}
              className="flex items-center justify-between gap-3 sm:gap-4 rounded-md px-1.5 py-1.5"
            >
              <span
                className={`w-4 shrink-0 text-right font-mono text-[10px] sm:text-xs font-semibold ${
                  isHighlighted ? 'text-accent' : 'text-text-tertiary'
                }`}
              >
                {entry.rank}
              </span>
              <div className="min-w-0 flex-1 flex flex-col gap-1 md:gap-2">
                <p className="truncate text-xs sm:text-sm md:text-base text-text" title={label}>
                  {label}
                </p>
                <RankBar
                  value={entry.value}
                  maxAbsValue={maxAbsValue}
                  isHighlighted={isHighlighted}
                  isDiverging={isDiverging}
                />
              </div>
              {isDiverging ? (
                <DivergingValue value={entry.value} />
              ) : (
                <span className="w-10 shrink-0 text-left font-mono text-xs font-semibold text-text-secondary">
                  {formatNumber.format(entry.value)}
                  {unit}
                </span>
              )}
            </li>
          );
        })}
        {isLoading && <RankSkeleton rows={RANK_PAGE_SIZE} />}
      </ol>
      <RankPagination
        shown={ranks.length}
        hasMore={hasMore}
        canCollapse={canCollapse}
        isLoading={isLoading}
        onLoadMore={loadMore}
        onCollapse={collapseRanks}
      />
    </div>
  );
}
