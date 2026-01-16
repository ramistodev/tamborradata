import { useRef, useState } from 'react';
import { CommonNameBySchool, CommonNameBySchoolData } from '../../../types/types';
import { useGlobal } from '../../../hooks/useGlobal';
import { useCategory } from '../../../hooks/useCategory';
import { GLOBAL_STATS_KEY } from '@/app/(frontend)/shared/constants/app';
import { useTable } from '../../../hooks/useTable';

export function useCommonNameBySchool() {
  const { stats } = useGlobal();
  const { categoryData, isLoading, refetch } = useCategory<CommonNameBySchoolData>(
    stats?.commonNameBySchool[0].category || '',
    GLOBAL_STATS_KEY,
    false
  );

  const [commonNameBySchool, setCommonNameBySchool] = useState(stats?.commonNameBySchool || []);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<CommonNameBySchool, CommonNameBySchoolData>(
    setCommonNameBySchool,
    categoryData ?? [],
    refetch,
    tableRef
  );

  return {
    commonNameBySchool,
    isLoading,
    hasMore,
    tableRef,
    showMore,
    showLess,
  };
}
