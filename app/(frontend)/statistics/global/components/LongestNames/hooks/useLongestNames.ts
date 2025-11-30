import { useRef, useState } from 'react';
import { useGlobal } from '../../../hooks/useGlobal';
import { useCategory } from '../../../hooks/useCategory';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';
import { useTable } from '../../../hooks/useTable';
import { LongestName } from '../../../types/types';

export function useLongestNames() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, isFetching, refetch } = useCategory<string>(
    stats?.longestNames[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [longestNames, setLongestNames] = useState(stats?.longestNames || []);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<LongestName, string>(
    setLongestNames,
    categoryData ?? [],
    refetch,
    tableRef
  );

  return {
    longestNames,
    isLoading,
    isFetching,
    hasMore,
    tableRef,
    showMore,
    showLess,
  };
}
