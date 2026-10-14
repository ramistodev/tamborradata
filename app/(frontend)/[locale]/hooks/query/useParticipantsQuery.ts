import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '../../services/fetchParticipants';
import { queryKeys } from '../../lib/queryKeys';

/** Records matching a name in a school. Empty strings keep it idle until a search is submitted. */
export function useParticipantsQuery(participant: string, schoolKey: string) {
  return useQuery({
    queryKey: queryKeys.participants(participant, schoolKey),
    queryFn: ({ signal }) => fetchParticipants({ participant, schoolKey, signal }),
    enabled: Boolean(participant) && Boolean(schoolKey),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: false,
  });
}
