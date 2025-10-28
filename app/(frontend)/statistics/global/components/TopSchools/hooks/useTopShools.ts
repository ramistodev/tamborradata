import { useRef, useState } from 'react';
import { TopSchool } from '../../../types/types';
import { fetchCategory } from '../../../logic/fetchCategory';

export function useTopSchools(initialStats: TopSchool[]) {
  const [stats, setStats] = useState<TopSchool[]>(initialStats);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [chart, setChart] = useState(false);
  const cacheRef = useRef<TopSchool[] | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  function showChart() {
    setChart((prev) => !prev);
  }

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
      fetchCategory<TopSchool>(stats[0].category, 'global')
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

  return { stats, loading, hasMore, tableRef, chart, showMore, showLess, showChart };
}
