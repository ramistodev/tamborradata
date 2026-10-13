'use client';
import { useFormatter, useTranslations } from 'next-intl';
import type { RankCategory } from '@/app/types/api/statistics.types';
import { categoryRendererKey } from '../../../../../../../types/statistics';
import { RANK_PAGE_SIZE, useRank } from '../../hooks/useRank';
import { RankPagination } from './shared/RankPagination';
import { DataTableSkeleton } from './DataTableSkeleton';

const headerCell =
  'border-b-2 border-border px-3 py-2 font-mono text-[10px] md:text-xs font-semibold uppercase leading-none tracking-widest text-text-tertiary whitespace-nowrap';

/** One row per school with the entity that leads it and how many times it appears. */
export function DataTableRender({ category }: { category: RankCategory }) {
  const {
    ranks,
    listRef,
    formatNumber,
    hasMore,
    canCollapse,
    isLoading,
    hasError,
    loadMore,
    collapseRanks,
  } = useRank(category);
  const t = useTranslations('Statistics.layout');
  const tCategory = useTranslations('Statistics.categories');

  if (category.data.length === 0) return null;
  if (category.rendererKey != categoryRendererKey.dataTable) return null;

  const schoolHeader = t(`table.${category.category}.school`);
  const entityHeader = t(`table.${category.category}.entity`);
  const valueHeader = t('tableValue');
  const title = tCategory(`${category.category}.title`);

  return (
    <div ref={listRef} className="flex flex-col gap-2">
      <div
        role="region"
        aria-label={title}
        tabIndex={0}
        className="overflow-x-auto rounded-lg scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <table aria-busy={isLoading} className="w-full border-collapse text-xs md:text-sm">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              <th scope="col" className={`text-left ${headerCell}`}>
                {schoolHeader}
              </th>
              <th scope="col" className={`text-left ${headerCell}`}>
                {entityHeader}
              </th>
              <th scope="col" className={`text-right ${headerCell}`}>
                {valueHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((entry, index) => (
              <tr
                key={`${entry.groupSchool?.schoolId ?? index}-${entry.entityKey ?? index}`}
                className={index % 2 === 1 ? 'bg-bg-secondary' : undefined}
              >
                <th
                  scope="row"
                  className="border-b border-border px-3 py-2 text-left font-normal text-text"
                >
                  {entry.groupSchool?.canonicalName ?? '—'}
                </th>
                <td className="border-b border-border px-3 py-2 text-left text-text-secondary">
                  {entry.entityLabel ?? '—'}
                </td>
                <td className="border-b border-border px-3 py-2 text-right font-mono text-text-tertiary">
                  {formatNumber.format(entry.value)}
                </td>
              </tr>
            ))}
            {isLoading && <DataTableSkeleton rows={RANK_PAGE_SIZE} />}
          </tbody>
        </table>
      </div>
      <RankPagination
        shown={ranks.length}
        hasMore={hasMore}
        canCollapse={canCollapse}
        isLoading={isLoading}
        hasError={hasError}
        onLoadMore={loadMore}
        onCollapse={collapseRanks}
      />
    </div>
  );
}
