import { useRef, useState } from 'react';
import { CommonNameBySchoolData } from '../../../types/types';
import { fetchCategory } from '../../../../logic/fetchCategory';
import { useGlobalContext } from '../../../context/useGlobalContext';
import { scrollToTopTable } from '../../../utils/scrollToTopTable';

export function useCommonNameBySchool() {
  const { statistics } = useGlobalContext();
  const [stats, setStats] = useState(statistics?.commonNameBySchool || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cacheRef = useRef<CommonNameBySchoolData[] | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  function showMore() {
    setLoading(true);
    setHasMore(false);

    if (cacheRef.current) {
      // Si hay datos en cache, úsalos sin hacer fetch
      const data = cacheRef.current;
      setStats((prev) => {
        if (prev.length === 0) return prev;
        const updatedFirst = { ...prev[0], public_data: data as CommonNameBySchoolData[] };
        return [updatedFirst, ...prev.slice(1)];
      });
      setLoading(false);
      return;
    } else {
      // Si no hay cache, haz el fetch
      fetchCategory<CommonNameBySchoolData>(stats[0].category, 'global')
        .then((newData) => {
          if (newData) {
            cacheRef.current = newData; // Guarda los datos de public_data en cache
            setStats((prev) => {
              if (prev.length === 0) return prev;
              const updatedFirst = { ...prev[0], public_data: newData as CommonNameBySchoolData[] };
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

  return {
    stats,
    loading,
    hasMore,
    tableRef,
    showMore,
    showLess,
  };
}
