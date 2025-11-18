import { useRef, useState } from 'react';
import { fetchCategory } from '../../logic/fetchCategory';
import { useGlobalContext } from '../context/useGlobalContext';
import { GlobalStats } from '../types/types';

// T es el tipo de cada fila del public_data (TopNameData, TopSchoolData…)
// K es la clave de statistics (topNames, topSchools, etc.)
export function useCategoryBase<T, K extends keyof GlobalStats>(key: K) {
  const { statistics } = useGlobalContext();
  const [stats, setStats] = useState<any[]>(statistics?.[key] || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [chart, setChart] = useState(false);
  const cacheRef = useRef<T[] | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Alternar gráfico (si aplica)
  function toggleChart() {
    setChart((prev) => !prev);
  }

  // Mostrar más registros
  function showMore() {
    setLoading(true);
    setHasMore(false);

    if (cacheRef.current) {
      setStats((prev) => updateStats(prev, cacheRef.current as T[]));
      setLoading(false);
      return;
    }

    const category = stats?.[0]?.category;
    if (!category) return;

    fetchCategory<T>(category, 'global')
      .then((newData) => {
        if (newData) {
          cacheRef.current = newData;
          setStats((prev) => updateStats(prev, newData as T[]));
        }
      })
      .finally(() => setLoading(false));
  }

  // Mostrar menos registros y hacer scroll arriba
  function showLess() {
    setStats((prev) => {
      if (prev.length === 0) return prev;
      const updateFirst = {
        ...prev[0],
        public_data: prev[0].public_data.slice(0, 15),
      };
      return [updateFirst, ...prev.slice(1)];
    });

    setTimeout(() => scrollToTable(tableRef.current), 10);
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
    toggleChart,
  };
}

// Helpers reutilizables
function updateStats(prev: any[], newData: any[]) {
  if (prev.length === 0) return prev;
  const updatedFirst = { ...prev[0], public_data: newData };
  return [updatedFirst, ...prev.slice(1)];
}

function scrollToTable(el: HTMLTableElement | null) {
  if (!el) return;
  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const rect = el.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;
  window.scrollTo({
    top: Math.max(0, absoluteTop - headerHeight - 120),
    behavior: 'smooth',
  });
}
