import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '@/app/(frontend)/services/fetchParticipants';
import { queryKeys } from '../../lib/queryKeys';

export function useParticipantsQuery<T>(name: string, company: string) {
  return useQuery({
    queryKey: queryKeys.participants(name, company),
    queryFn: () => fetchParticipants<T>(name, company),
    enabled: Boolean(name) && Boolean(company),
    staleTime: Infinity, // siempre refetch con nuevos params
    gcTime: Infinity, // no persistir resultados viejos
    retry: false, // no reintentar
    refetchOnWindowFocus: false,
  });
}
