import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ParticipantsResponse } from '../../../../../../types/api/participants.types';
import type { SearchParams } from '../../hooks/useSearchForm';
import { getRetryMinutes } from '../../utils/getRetryMinutes';

/** Lets the region empty out first, so an identical message is announced again. */
const ANNOUNCE_DELAY_MS = 150;

type SearchAnnouncerProps = {
  search: SearchParams | null;
  records: ParticipantsResponse[] | undefined;
  isFetching: boolean;
  isError: boolean;
  retryAfterSeconds: number | null;
};

/**
 * The only live region of the results: it says that the search is running, how many results came
 * back, that there were none, or that it failed. The visible panels are not live regions, so
 * nothing is announced twice. It stays mounted, because a region added together with its text is
 * often not announced.
 */
export function SearchAnnouncer({
  search,
  records,
  isFetching,
  isError,
  retryAfterSeconds,
}: SearchAnnouncerProps) {
  const tResults = useTranslations('Search.results');
  const tStatus = useTranslations('Search.status');
  const [message, setMessage] = useState('');

  let text = '';
  if (search) {
    if (isFetching) {
      text = tResults('loading');
    } else if (retryAfterSeconds !== null) {
      text = `${tStatus('rateLimited.title')}. ${tStatus('rateLimited.description', {
        minutes: getRetryMinutes(retryAfterSeconds),
      })}`;
    } else if (isError) {
      text = `${tStatus('error.title')}. ${tStatus('error.description')}`;
    } else if (!records || records.length === 0) {
      text = `${tStatus('noResults.title')}. ${tStatus('noResults.description')}`;
    } else {
      text = tResults('announce', {
        records: records.length,
        participations: records.reduce((total, record) => total + record.participations.length, 0),
        participant: search.participant,
        school: records[0].school.canonicalName,
      });
    }
  }

  // `search` is a new object on every submit, so repeating the same search is announced again
  useEffect(() => {
    setMessage('');
    if (!text) return;

    const timer = setTimeout(() => setMessage(text), ANNOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [text, search]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
