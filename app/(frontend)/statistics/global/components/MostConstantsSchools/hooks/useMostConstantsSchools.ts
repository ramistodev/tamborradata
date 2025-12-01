import { useRef, useState } from 'react';
import { useGlobal } from '../../../hooks/useGlobal';
import { useCategory } from '../../../hooks/useCategory';
import { MostConstantSchool, MostConstantSchoolData } from '../../../types/types';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';
import { useTable } from '../../../hooks/useTable';

export function useMostConstantsSchools() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, refetch } = useCategory<MostConstantSchoolData>(
    stats?.mostConstantSchools[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [mostConstantSchools, setMostConstantSchools] = useState(stats?.mostConstantSchools || []);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<MostConstantSchool, MostConstantSchoolData>(
    setMostConstantSchools,
    categoryData ?? [],
    refetch,
    tableRef
  );

  return {
    mostConstantSchools,
    isLoading,
    hasMore,
    tableRef,
    showMore,
    showLess,
  };
}
