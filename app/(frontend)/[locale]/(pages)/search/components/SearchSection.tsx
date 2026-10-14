'use client';
import { useId, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { SchoolListResult } from '../../../../../types/api/schools.types';
import { useParticipantsQuery } from '../../../hooks/query/useParticipantsQuery';
import { useSearchForm } from '../hooks/useSearchForm';
import { SearchForm } from './SearchForm';
import { SearchAnnouncer } from './results/SearchAnnouncer';
import { SearchResults } from './results/SearchResults';

export function SearchSection({ schools }: { schools: SchoolListResult[] }) {
  const t = useTranslations('Search.results');
  const resultsHeadingId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const { name, setName, schoolKey, setSchoolKey, isNameValid, canSubmit, search, submit, clear } =
    useSearchForm(schools.map(({ schoolKey }) => schoolKey));

  const { data, isFetching, isError, refetch } = useParticipantsQuery(
    search?.participant ?? '',
    search?.schoolKey ?? ''
  );

  const schoolOptions = useMemo(
    () => schools.map(({ school, schoolKey }) => ({ value: schoolKey, label: school })),
    [schools]
  );

  // The button that was pressed disappears with the panel it is in, so focus is moved on purpose
  // instead of falling back to the top of the page
  function handleClear() {
    clear();
    nameInputRef.current?.focus();
  }

  function handleRetry() {
    resultsHeadingRef.current?.focus();
    void refetch();
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchForm
        name={name}
        onNameChange={setName}
        nameInputRef={nameInputRef}
        schoolKey={schoolKey}
        onSchoolChange={setSchoolKey}
        schoolOptions={schoolOptions}
        isNameValid={isNameValid}
        canSubmit={canSubmit}
        isSearching={isFetching}
        onSubmit={submit}
      />
      <section aria-labelledby={resultsHeadingId}>
        <h2 id={resultsHeadingId} ref={resultsHeadingRef} tabIndex={-1} className="sr-only">
          {t('title')}
        </h2>
        <SearchAnnouncer search={search} records={data} isFetching={isFetching} isError={isError} />
        <SearchResults
          search={search}
          records={data}
          isFetching={isFetching}
          isError={isError}
          onRetry={handleRetry}
          onClear={handleClear}
        />
      </section>
    </div>
  );
}
