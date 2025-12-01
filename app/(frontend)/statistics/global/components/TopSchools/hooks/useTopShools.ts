import { useRef, useState } from 'react';
import { TopSchool, TopSchoolData } from '../../../types/types';
import { useTable } from '../../../hooks/useTable';
import { useCategory } from '../../../hooks/useCategory';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';
import { useGlobal } from '../../../hooks/useGlobal';

export function useTopSchools() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, refetch } = useCategory<TopSchoolData>(
    stats?.topSchools[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [topSchoolsStats, setTopSchoolsStats] = useState(stats?.topSchools || []);
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
    hasMore,
    tableRef,
    chart,
    showMore,
    showLess,
    showChart,
  };
}
