import { useYearsQuery } from '@/app/(frontend)/[locale]/hooks/query/useYearsQuery';

export function useStatisticsY() {
  const { data: years, isLoading, isError } = useYearsQuery();

  return {
    years,
    isLoading,
    isError,
  };
}
