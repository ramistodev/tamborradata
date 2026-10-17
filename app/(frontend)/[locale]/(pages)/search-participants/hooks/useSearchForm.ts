import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { MIN_PARTICIPANT_WORDS } from '../../../../../types/api/participants.types';
import { useParticipantsQuery } from '../../../hooks/query/useParticipantsQuery';
import { RateLimitedError } from '../../../lib/errors';

export type SearchParams = {
  participant: string;
  schoolKey: string;
};

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const cleanName = (text: string) => text.trim().replace(/\s+/g, ' ');

/** Form fields, their validation and the search that was last submitted. */
export function useSearchForm() {
  const [name, setName] = useState('');
  const [schoolKey, setSchoolKey] = useState<string | null>(null);
  const [search, setSearch] = useState<SearchParams | null>(null);
  const resultsHeadingId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const schoolDropdownRef = useRef<HTMLButtonElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const { data, isFetching, isError, error, refetch } = useParticipantsQuery(
    search?.participant ?? '',
    search?.schoolKey ?? ''
  );

  const isNameValid = countWords(name) >= MIN_PARTICIPANT_WORDS;
  const canSubmit = !!schoolKey && isNameValid;
  const retryAfterSeconds = error instanceof RateLimitedError ? error.retryAfterSeconds : null;

  function submit() {
    if (!canSubmit) return;

    setSearch({ participant: cleanName(name), schoolKey });
  }

  function clear() {
    setName('');
    setSchoolKey(null);
    setSearch(null);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isFetching) return;

    if (!canSubmit) {
      if (isNameValid) schoolDropdownRef.current?.focus();
      else nameInputRef.current?.focus();
      return;
    }

    submit();
  }

  return {
    name,
    schoolKey,
    search,
    resultsHeadingId,
    nameInputRef,
    schoolDropdownRef,
    resultsHeadingRef,
    data,
    isFetching,
    isError,
    isNameValid,
    canSubmit,
    retryAfterSeconds,
    setName,
    setSchoolKey,
    handleSubmit,
    clear,
    refetch,
  };
}
