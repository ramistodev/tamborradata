import { useRef, useState } from 'react';
import { CommonNameBySchool, CommonNameBySchoolData } from '../../../types/types';
import { useYears } from '../../../hooks/useYears';
import { useCategory } from '../../../hooks/useCategory';
import { useTable } from '../../../hooks/useTable';

export function useCommonNamesBySchool() {
  const { stats, year } = useYears();
  const { categoryData, isLoading, refetch } = useCategory<CommonNameBySchoolData>(
    stats?.commonNameBySchoolByYear[0].category || '',
    year,
    false
  );

  const [commonNamesStats, setCommonNamesStats] = useState(stats?.commonNameBySchoolByYear || []);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const { hasMore, showMore, showLess } = useTable<CommonNameBySchool, CommonNameBySchoolData>(
    setCommonNamesStats,
    categoryData ?? [],
    refetch,
    tableRef
  );

  return {
    commonNamesStats,
    isLoading,
    hasMore,
    tableRef,
    showMore,
    showLess,
  };
}
