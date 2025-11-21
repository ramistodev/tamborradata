import { useSearchContext } from '@/app/(frontend)/search/context/useSearchContext';
import { SearchNotFound } from './SearchNotFound';
import { ResultsPlaceholder } from './ResultsPlaceholder';
import { ParticipantResultsList } from './ParticipantResultsList';
import { ResultsLoading } from './ResultsLoading';

export function Results() {
  const { participants, isLoading } = useSearchContext();

  if (isLoading) return <ResultsLoading />;

  if (participants === null) return <ResultsPlaceholder />;

  if (!participants || participants.length === 0) return <SearchNotFound />;

  if (participants && participants.length > 0) return <ParticipantResultsList />;
}
