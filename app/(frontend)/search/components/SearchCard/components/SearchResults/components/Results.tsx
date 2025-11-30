import { SearchNotFound } from './SearchNotFound';
import { ResultsPlaceholder } from './ResultsPlaceholder';
import { ParticipantResultsList } from './ParticipantResultsList';
import { ResultsLoading } from './ResultsLoading';
import { useParticipants } from '@/app/(frontend)/search/hooks/useParticipants';

export function Results({ params }: { params: { name: string; company: string } | null }) {
  const { participants, isLoading, isFetching, isError } = useParticipants({ params });

  if (isLoading || isFetching) return <ResultsLoading />;

  if (isError) return <SearchNotFound />;

  if (participants && participants.length > 0)
    return <ParticipantResultsList participants={participants} />;

  return <ResultsPlaceholder />;
}
