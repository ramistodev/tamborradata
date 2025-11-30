import { useParticipantsQuery } from '../../hooks/query/useParticipantsQuery';
import { Participants } from '../types/types';

export function useParticipants({ params }: { params: { name: string; company: string } | null }) {
  const {
    data: participants,
    isLoading,
    isFetching,
    isError,
  } = useParticipantsQuery<Participants[]>(params?.name ?? '', params?.company ?? '');

  return {
    participants,
    isLoading,
    isFetching,
    isError,
  };
}
