import { useRef, useState } from 'react';
import { useTable } from '../../../hooks/useTable';
import { useYears } from '../../../hooks/useYears';
import { useCategory } from '../../../hooks/useCategory';
import { NewName } from '../../../types/types';

export function useNewNames() {
  const { stats, year } = useYears();
  const { categoryData, isLoading, refetch } = useCategory<string>(
    stats?.newNamesByYear?.[0]?.category || '',
    year,
    false
  );

  const [newNamesStats, setNewNamesStats] = useState(stats?.newNamesByYear || []);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<NewName, string>(
    setNewNamesStats,
    categoryData ?? [],
    refetch,
    tableRef
  );

  return {
    newNamesStats,
    isLoading,
    hasMore,
    tableRef,
    showMore,
    showLess,
  };
}
