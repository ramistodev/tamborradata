import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCategoryQuery } from '../../../../hooks/query/useCategoryQuery';
import { useNumberFormatter } from '../../../../../i18n/useNumberFormatter';
import type { RankCategory, StatisticRank } from '../../../../../../types/api/statistics.types';

export const RANK_PAGE_SIZE = 10;
export const MAX_EXTRA_ROWS = 40;

/**
 * Rows of a ranking. `allRows` is what we have (server rows + fetched pages, kept in the query
 * cache) and `visible` is how many of them are shown, so collapsing never refetches and expanding
 * again is instant.
 */
export function useRank(category: RankCategory) {
  const { period } = useParams<{ period: string }>();
  const formatNumber = useNumberFormatter();
  const listRef = useRef<HTMLDivElement>(null);
  const initialRows = category.data;
  const initialCursor = category.pageInfo.nextCursor ?? undefined;
  const [visible, setVisible] = useState(initialRows.length);

  const query = useCategoryQuery(category.category, period, {
    initialCursor,
    limit: RANK_PAGE_SIZE,
    enabled: false, // no pide nada hasta que se pulse el botón
  });

  const fetchedRows = (
    query.data?.pages.flatMap((page) => page.data as StatisticRank[]) ?? []
  ).slice(0, MAX_EXTRA_ROWS);
  const allRows = [...initialRows, ...fetchedRows];
  const ranks = allRows.slice(0, visible);

  // Before the first request `hasNextPage` is false, so the server's cursor decides.
  const canFetchMore =
    fetchedRows.length < MAX_EXTRA_ROWS &&
    (query.data ? query.hasNextPage : initialCursor !== undefined);
  const hasMore = visible < allRows.length || canFetchMore;
  const canCollapse = visible > initialRows.length;
  // Biggest magnitude among the rows fetched so far. In a plain ranking the leader is in the first
  // page, so the bars never rescale; in a signed one the deepest decline sits at the end and the
  // scale grows only when a page brings a bigger value. `allRows` survives a collapse, so
  // collapsing and expanding again never changes the bars.
  const maxAbsValue = Math.max(...allRows.map((entry) => Math.abs(entry.value)));

  const loadMore = async () => {
    const target = visible + RANK_PAGE_SIZE;

    if (target > allRows.length && canFetchMore) {
      // On failure (network, server or timeout) `visible` stays put and `hasError` is raised.
      const result = await query.fetchNextPage();

      if (result.isError) {
        return;
      }
    }

    setVisible(target);
  };

  const collapseRanks = () => {
    setVisible(initialRows.length);
    listRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  return {
    ranks,
    listRef,
    formatNumber,
    maxAbsValue,
    hasMore,
    canCollapse,
    isLoading: query.isFetching,
    // Stays true until the next attempt starts, so the retry button is just `loadMore` again.
    hasError: query.isFetchNextPageError,
    loadMore,
    collapseRanks,
  };
}
