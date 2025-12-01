import { useQuery } from '@tanstack/react-query';
import { fetchYears } from '@/app/(frontend)/services/fetchYears';
import { queryKeys } from '@/app/(frontend)/lib/queryKeys';

export function useYearsQuery() {
  return useQuery({
    queryKey: queryKeys.years,
    queryFn: async () => fetchYears(),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
