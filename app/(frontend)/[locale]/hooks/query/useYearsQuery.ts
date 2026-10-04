import { useQuery } from '@tanstack/react-query';
import { fetchYears } from '@/app/(frontend)/[locale]/services/fetchYears';
import { queryKeys } from '@/app/(frontend)/[locale]/lib/queryKeys';

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
