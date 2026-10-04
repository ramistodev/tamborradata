import { useRef, useState } from 'react';
import { TopSurname, TopSurnameData } from '../../../types/types';
import { useTable } from '../../../hooks/useTable';
import { useCategory } from '../../../hooks/useCategory';
import { useYears } from '../../../hooks/useYears';

export function useTopSurnames() {
  const { stats, year } = useYears();
  const { categoryData, isLoading, refetch } = useCategory<TopSurnameData>(
    stats?.topSurnamesByYear[0].category || '',
    year,
    false
  );

  const [topSurnamesStats, setTopSurnamesStats] = useState(stats?.topSurnamesByYear || []);
  const [chart, setChart] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<TopSurname, TopSurnameData>(
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
    hasMore,
    tableRef,
    chart,
    showMore,
    showLess,
    showChart,
  };
}
