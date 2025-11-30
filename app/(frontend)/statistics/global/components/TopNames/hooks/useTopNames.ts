import { useRef, useState } from 'react';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';
import { TopName, TopNameData } from '../../../types/types';
import { useGlobal } from '../../../hooks/useGlobal';
import { useCategory } from '../../../hooks/useCategory';
import { useTable } from '../../../hooks/useTable';

export function useTopNames() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, isFetching, refetch } = useCategory<TopNameData>(
    stats?.topNames[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [topNamesStats, setTopNamesStats] = useState(stats?.topNames || []);
  const [chart, setChart] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<TopName, TopNameData>(
    setTopNamesStats,
    categoryData ?? [],
    refetch,
    tableRef
  );

  function showChart() {
    setChart((prev) => !prev);
  }

  return {
    topNamesStats,
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
