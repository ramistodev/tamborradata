import { useRef, useState } from 'react';
import { SchoolEvolution, Year } from '../../../types/types';
import { fetchCategory } from '../../../logic/fetchCategory';

export function useSchoolsEvolution(initialStats: SchoolEvolution[]) {
  const [stats, setStats] = useState<SchoolEvolution[]>(initialStats);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [chart, setChart] = useState(false);
  const [chartData, setChartData] = useState<Year[] | null>(null);
  const cacheRef = useRef<SchoolEvolution[] | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  function showMore() {
    setLoading(true);
    setHasMore(false);

    if (cacheRef.current) {
      // Si hay datos en cache, úsalos sin hacer fetch
      const data = cacheRef.current;
      setStats((prev) => {
        if (prev.length === 0) return prev;
        const updatedFirst = { ...prev[0], public_data: data as any };
        return [updatedFirst, ...prev.slice(1)];
      });
      setLoading(false);
      return;
    } else {
      // Si no hay cache, haz el fetch
      fetchCategory<SchoolEvolution>(stats[0].category, 'global')
        .then((newData) => {
          if (newData) {
            cacheRef.current = newData; // Guarda los datos de public_data en cache
            setStats((prev) => {
              if (prev.length === 0) return prev;
              const updatedFirst = { ...prev[0], public_data: newData as any };
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

    setTimeout(() => {
      const el = tableRef.current;
      if (!el) return;
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const rect = el.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      // ajusta 120px de separación respecto al header
      window.scrollTo({ top: Math.max(0, absoluteTop - headerHeight - 120), behavior: 'smooth' });
    }, 60);

    setHasMore(true);
  }

  const yearsSet = new Set<number>();
  stats[0].public_data.forEach((school) => {
    school.years?.forEach((y) => yearsSet.add(y.year));
  });

  const years = Array.from(yearsSet).sort((a, b) => b - a);

  function showChart(data?: Year[]) {
    setChart((prev) => !prev);

    if (data) {
      const chartData = years.map((year) => {
        const found = data.find((d) => d.year === year);
        return found ? { year, count: found.count } : { year, count: 0 };
      });
      setChartData(chartData.sort((a, b) => a.year - b.year));
    }
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
