import { QueryObserverResult } from '@tanstack/react-query';
import { useState } from 'react';
import { scrollToTopTable } from '../utils/scrollToTopTable';

type WithPublicData<T> = T & { public_data: any[] };

export function useTable<T, U>(
  setStats: React.Dispatch<React.SetStateAction<WithPublicData<T>[]>>,
  categoryData: U[],
  refetch: () => Promise<QueryObserverResult<U[], Error>>,
  tableRef: React.RefObject<HTMLTableElement>
) {
  const [hasMore, setHasMore] = useState(true);

  async function showMore() {
    setHasMore(false);

    // Si ya hay datos en cache, úsalos directamente
    if (categoryData && categoryData.length > 0) {
      setStats((prev) => {
        if (prev.length === 0) return prev;
        const updatedFirst = { ...prev[0], public_data: categoryData };
        return [updatedFirst, ...prev.slice(1)];
      });
      return;
    }

    // Si no hay datos, hace fetch
    const { data } = await refetch();
    if (data) {
      setStats((prev) => {
        if (prev.length === 0) return prev;
        const updatedFirst = { ...prev[0], public_data: data };
        return [updatedFirst, ...prev.slice(1)];
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
    hasMore,
    showMore,
    showLess,
  };
}
