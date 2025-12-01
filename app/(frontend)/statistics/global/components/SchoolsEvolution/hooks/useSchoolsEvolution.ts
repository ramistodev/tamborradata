import { useMemo, useRef, useState } from 'react';
import { SchoolsEvolution, SchoolsEvolutionData } from '../../../types/types';
import { useGlobal } from '../../../hooks/useGlobal';
import { useCategory } from '../../../hooks/useCategory';
import { useTable } from '../../../hooks/useTable';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';

export function useSchoolsEvolution() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, refetch } = useCategory<SchoolsEvolutionData>(
    stats?.schoolsEvolution[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [schoolsEvolution, setSchoolsEvolution] = useState(stats?.schoolsEvolution || []);
  const [chart, setChart] = useState(false);
  const [chartData, setChartData] = useState<SchoolsEvolutionData | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<SchoolsEvolution, SchoolsEvolutionData>(
    setSchoolsEvolution,
    categoryData ?? [],
    refetch,
    tableRef
  );

  const [tableYears, allYears] = useMemo(() => {
    const allYears = new Set<number>();

    schoolsEvolution[0]?.public_data.forEach((school) =>
      school.years?.forEach((y) => allYears.add(y.year))
    );

    const tableYears =
      allYears.size <= 7
        ? Array.from(allYears).sort((a, b) => a - b)
        : Array.from(allYears)
            .sort((a, b) => a - b)
            .slice(allYears.size - 7, allYears.size);

    const sortedAllYears = Array.from(allYears).sort((a, b) => a - b);

    return [tableYears, sortedAllYears];
  }, [schoolsEvolution]);

  function showChart(data?: SchoolsEvolutionData) {
    setChart((prev) => !prev);
    setChartData(data || null);
  }

  return {
    schoolsEvolution,
    isLoading,
    hasMore,
    tableRef,
    tableYears,
    allYears,
    chart,
    chartData,
    showMore,
    showLess,
    showChart,
  };
}
