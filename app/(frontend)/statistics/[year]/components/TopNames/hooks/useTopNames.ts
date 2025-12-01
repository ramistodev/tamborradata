import { useRef, useState } from 'react';
import { TopName, TopNameData } from '../../../types/types';
import { useYears } from '../../../hooks/useYears';
import { useCategory } from '../../../hooks/useCategory';
import { useTable } from '../../../hooks/useTable';

export function useTopNames() {
  const { stats, year } = useYears();
  const { categoryData, isLoading, refetch } = useCategory<TopNameData>(
    stats?.topNamesByYear[0].category || '',
    year,
    false
  );

  const [topNamesStats, setTopNamesStats] = useState(stats?.topNamesByYear || []);
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
    hasMore,
    tableRef,
    chart,
    showMore,
    showLess,
    showChart,
  };
}
