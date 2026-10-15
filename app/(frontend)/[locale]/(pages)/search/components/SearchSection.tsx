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

  const {
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
    retryAfterSeconds,
    isNameValid,
    canSubmit,
    setName,
    setSchoolKey,
    handleSubmit,
    clear,
    refetch,
  } = useSearchForm();

  const schoolOptions = useMemo(
    () => schools.map(({ school, schoolKey }) => ({ value: schoolKey, label: school })),
    [schools]
  );

  return (
    <div className="flex flex-col gap-6">
      <SearchForm
        name={name}
        onNameChange={setName}
        nameInputRef={nameInputRef}
        schoolDropdownRef={schoolDropdownRef}
        schoolKey={schoolKey}
        onSchoolChange={setSchoolKey}
        schoolOptions={schoolOptions}
        isNameValid={isNameValid}
        canSubmit={canSubmit}
        isSearching={isFetching}
        handleSubmit={handleSubmit}
      />
      <section aria-labelledby={resultsHeadingId}>
        <h2 id={resultsHeadingId} ref={resultsHeadingRef} tabIndex={-1} className="sr-only">
          {t('title')}
        </h2>
        <SearchAnnouncer
          search={search}
          records={data}
          isFetching={isFetching}
          isError={isError}
          retryAfterSeconds={retryAfterSeconds}
        />
        <SearchResults
          search={search}
          records={data}
          isFetching={isFetching}
          isError={isError}
          retryAfterSeconds={retryAfterSeconds}
          onRetry={refetch}
          onClear={clear}
        />
      </section>
    </div>
  );
}
