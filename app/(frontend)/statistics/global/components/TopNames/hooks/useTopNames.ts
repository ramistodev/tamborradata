import { useRef, useState } from 'react';
import { TopNameData } from '../../../types/types';
import { fetchCategory } from '../../../../logic/fetchCategory';
import { useGlobalContext } from '../../../context/useGlobalContext';

export function useTopNames() {
  const { statistics } = useGlobalContext();
  const [stats, setStats] = useState(statistics?.topNames || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [chart, setChart] = useState(false);
  const cacheRef = useRef<TopNameData[] | null>(null);
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
        const updatedFirst = { ...prev[0], public_data: data as TopNameData[] };
        return [updatedFirst, ...prev.slice(1)];
      });
      setLoading(false);
      return;
    } else {
      // Si no hay cache, haz el fetch
      fetchCategory<TopNameData>(stats[0].category, 'global')
        .then((newData) => {
          if (newData) {
            cacheRef.current = newData; // Guarda los datos de public_data en cache
            setStats((prev) => {
              if (prev.length === 0) return prev;
              const updatedFirst = { ...prev[0], public_data: newData as TopNameData[] };
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
      window.scrollTo({ top: Math.max(0, absoluteTop - headerHeight - 120), behavior: 'smooth' });
    }, 0);

    setHasMore(true);
  }

  return {
    stats,
    loading,
    hasMore,
    tableRef,
    chart,
    showMore,
    showLess,
    showChart,
  };
}
