import { useQuery } from '@tanstack/react-query';
import { fetchCategory } from '@/app/(frontend)/services/fetchCategory';
import { queryKeys } from '@/app/(frontend)/lib/queryKeys';

export function useCategoryQuery<T>(category: string, year: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.category(category, year),
    queryFn: () => fetchCategory<T>(category, year),
    enabled: enabled && Boolean(category) && Boolean(year),
    staleTime: Infinity, // Los datos no cambian, no es necesario refetching
    gcTime: Infinity, // nunca lo borra de la cache
    retry: 0, // no reintentar
    refetchOnWindowFocus: false,
  });
}
