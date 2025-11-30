import { useQuery } from '@tanstack/react-query';
import { fetchStatistics } from '@/app/(frontend)/services/fetchStatistics';
import { queryKeys } from '@/app/(frontend)/lib/queryKeys';

export function useStatisticsQuery<T>(year: string) {
  return useQuery({
    queryKey: queryKeys.statistics(year),
    queryFn: ({ signal }) => fetchStatistics<T>(year, signal),
    enabled: Boolean(year),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: false,
  });
}
