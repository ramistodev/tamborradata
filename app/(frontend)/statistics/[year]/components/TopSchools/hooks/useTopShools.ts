import { useRef, useState } from 'react';
import { TopSchool, TopSchoolData } from '../../../types/types';
import { useTable } from '../../../hooks/useTable';
import { useYears } from '../../../hooks/useYears';
import { useCategory } from '../../../hooks/useCategory';

export function useTopSchools() {
  const { stats, year } = useYears();
  const { categoryData, isLoading, isFetching, refetch } = useCategory<TopSchoolData>(
    stats?.topSchoolsByYear[0].category || '',
    year,
    false
  );

  const [topSchoolsStats, setTopSchoolsStats] = useState(stats?.topSchoolsByYear || []);
  const [chart, setChart] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<TopSchool, TopSchoolData>(
    setTopSchoolsStats,
    categoryData ?? [],
    refetch,
    tableRef
  );

  function showChart() {
    setChart((prev) => !prev);
  }

  return {
    topSchoolsStats,
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
