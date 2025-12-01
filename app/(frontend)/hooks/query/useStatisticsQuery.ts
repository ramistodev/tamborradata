import { useQuery } from '@tanstack/react-query';
import { fetchStatistics } from '@/app/(frontend)/services/fetchStatistics';
import { queryKeys } from '@/app/(frontend)/lib/queryKeys';

type StatsResponse = { isUpdating?: boolean };

export function useStatisticsQuery<T extends StatsResponse>(year: string) {
  return useQuery({
    queryKey: queryKeys.statistics(year),
    queryFn: ({ signal }) => fetchStatistics<T>(year, signal),
    enabled: Boolean(year),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: (query) => query.state.data?.isUpdating === true,
    refetchInterval: (query) => (query.state.data?.isUpdating ? 3000 : false),
  });
}
