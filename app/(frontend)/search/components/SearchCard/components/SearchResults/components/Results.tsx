import { useSearchContext } from '@/app/(frontend)/search/context/useSearchContext';
import { SearchNotFound } from './SearchNotFound';
import { ResultsPlaceholder } from './ResultsPlaceholder';
import { ParticipantResultsList } from './ParticipantResultsList';

export function Results() {
  const { participants } = useSearchContext();

  if (participants === null) return <ResultsPlaceholder />;

  if (!participants || participants.length === 0) return <SearchNotFound />;

  if (participants && participants.length > 0) return <ParticipantResultsList />;
}
