import type { ParticipantsResponse } from '../../../../../../types/api/participants.types';
import type { SearchParams } from '../../hooks/useSearchForm';
import { NoResults } from '../status/NoResults';
import { ParticipantCard } from './ParticipantCard';
import { ResultsSkeleton } from './ResultsSkeleton';
import { SearchError } from '../status/SearchError';
import { SearchPrompt } from '../status/SearchPrompt';
import { SearchSummary } from './SearchSummary';

type SearchResultsProps = {
  search: SearchParams | null;
  records: ParticipantsResponse[] | undefined;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onClear: () => void;
};

export function SearchResults({
  search,
  records,
  isFetching,
  isError,
  onRetry,
  onClear,
}: SearchResultsProps) {
  if (!search) return <SearchPrompt />;
  if (isFetching) return <ResultsSkeleton />;
  if (isError) return <SearchError onRetry={onRetry} />;
  if (!records || records.length === 0) return <NoResults />;

  const participations = records.reduce((total, record) => total + record.participations.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <SearchSummary
        records={records.length}
        participations={participations}
        participant={search.participant}
        school={records[0].school.canonicalName}
        onClear={onClear}
      />
      <div className="flex flex-wrap gap-4">
        {records.map((record) => (
          <ParticipantCard key={record.nameKey} record={record} />
        ))}
      </div>
    </div>
  );
}
