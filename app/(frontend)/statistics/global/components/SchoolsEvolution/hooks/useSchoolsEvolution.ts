import { useMemo, useRef, useState } from 'react';
import { SchoolsEvolutionData } from '../../../types/types';
import { fetchCategory } from '../../../../logic/fetchCategory';
import { useGlobalContext } from '../../../context/useGlobalContext';
import { scrollToTopTable } from '../../../utils/scrollToTopTable';

export function useSchoolsEvolution() {
  const { statistics } = useGlobalContext();
  const [stats, setStats] = useState(statistics?.schoolsEvolution || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [chart, setChart] = useState(false);
  const [chartData, setChartData] = useState<SchoolsEvolutionData | null>(null);
  const cacheRef = useRef<SchoolsEvolutionData[] | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  function showMore() {
    setLoading(true);
    setHasMore(false);

    if (cacheRef.current) {
      // Si hay datos en cache no se hace el fetch
      const data = cacheRef.current;
      setStats((prev) => {
        if (prev.length === 0) return prev;
        const updatedFirst = { ...prev[0], public_data: data as SchoolsEvolutionData[] };
        return [updatedFirst, ...prev.slice(1)];
      });
      setLoading(false);
      return;
    } else {
      // Si no hay cache, se hace el fetch
      fetchCategory<SchoolsEvolutionData>(stats[0].category, 'global')
        .then((newData) => {
          if (newData) {
            cacheRef.current = newData; // Guarda los datos de public_data en cache
            setStats((prev) => {
              if (prev.length === 0) return prev;
              const updatedFirst = { ...prev[0], public_data: newData as SchoolsEvolutionData[] };
              return [updatedFirst, ...prev.slice(1)];
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function showLess() {
    setStats((prev) => {
      if (prev.length === 0) return prev;
      const updateFirst = { ...prev[0], public_data: prev[0].public_data.slice(0, 15) };
      return [updateFirst, ...prev.slice(1)];
    });

    setHasMore(true);

    scrollToTopTable(tableRef.current);
  }

  const years = useMemo(() => {
    const allYears = new Set<number>();

    stats[0]?.public_data.forEach((school) => school.years?.forEach((y) => allYears.add(y.year)));

    return Array.from(allYears).sort((a, b) => b - a);
  }, [stats]);

  function showChart(data?: SchoolsEvolutionData) {
    setChart((prev) => !prev);
    setChartData(data || null);
  }

  return {
    stats,
    loading,
    hasMore,
    tableRef,
    years,
    chart,
    chartData,
    showMore,
    showLess,
    showChart,
  };
}
