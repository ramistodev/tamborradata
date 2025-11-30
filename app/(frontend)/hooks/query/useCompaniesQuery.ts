import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '@/app/(frontend)/services/fetchCompanies';
import { queryKeys } from '@/app/(frontend)/lib/queryKeys';

export function useCompaniesQuery() {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: fetchCompanies,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: false,
  });
}
