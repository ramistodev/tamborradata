import { useRef, useState } from 'react';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';
import { TopNameData, TopSurname } from '../../../types/types';
import { useGlobal } from '../../../hooks/useGlobal';
import { useCategory } from '../../../hooks/useCategory';
import { useTable } from '../../../hooks/useTable';

export function useTopSurnames() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, isFetching, refetch } = useCategory<TopNameData>(
    stats?.topSurnames[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [topSurnamesStats, setTopSurnamesStats] = useState(stats?.topSurnames || []);
  const [chart, setChart] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<TopSurname, TopNameData>(
    setTopSurnamesStats,
    categoryData ?? [],
    refetch,
    tableRef
  );

  function showChart() {
    setChart((prev) => !prev);
  }

  return {
    topSurnamesStats,
    isLoading,
    isFetching,
    hasMore,
    tableRef,
    chart,
    showMore,
    showLess,
    showChart,
  };
}
