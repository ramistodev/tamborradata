import { useYearsQuery } from '@/app/(frontend)/hooks/query/useYearsQuery';

export function useStatisticsY() {
  const { data: years, isLoading, isError } = useYearsQuery();

  return {
    years,
    isLoading,
    isError,
  };
}
