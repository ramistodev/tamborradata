import { useId, useRef } from 'react';
import type { FormEvent, RefObject } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../../../components/Icons';
import { Button, Input, Select } from '../../../components/ui';
import type { SelectOption } from '../../../components/ui';
import { MAX_PARTICIPANT_LENGTH } from '../../../../../types/api/participants.types';

type SearchFormProps = {
  name: string;
  onNameChange: (name: string) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
  schoolDropdownRef: RefObject<HTMLButtonElement | null>;
  schoolKey: string | null;
  onSchoolChange: (schoolKey: string) => void;
  schoolOptions: SelectOption[];
  isNameValid: boolean;
  canSubmit: boolean;
  isSearching: boolean;
  handleSubmit: (event: FormEvent) => void;
};

export function SearchForm({
  name,
  onNameChange,
  nameInputRef,
  schoolDropdownRef,
  schoolKey,
  onSchoolChange,
  schoolOptions,
  isNameValid,
  canSubmit,
  isSearching,
  handleSubmit,
}: SearchFormProps) {
  const t = useTranslations('Search.form');
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const hintId = `${id}-hint`;
  const schoolId = `${id}-school`;

  return (
    <form
      role="search"
      aria-label={t('ariaLabel')}
      onSubmit={handleSubmit}
      className="flex flex-col md:grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[3fr_2fr] sm:p-5"
    >
      <Input
        ref={nameInputRef}
        maxLength={MAX_PARTICIPANT_LENGTH}
        type="text"
        name="participant"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder={t('name.placeholder')}
        aria-label={t('name.ariaLabel')}
        aria-required="true"
        aria-describedby={hintId}
        autoCapitalize="words"
        autoComplete="off"
        enterKeyHint="search"
        spellCheck={false}
      />
      <Select
        ref={schoolDropdownRef}
        id={schoolId}
        options={schoolOptions}
        value={schoolKey}
        onChange={onSchoolChange}
        placeholder={t('school.placeholder')}
        ariaLabel={t('school.ariaLabel')}
        describedBy={hintId}
        searchable
        searchPlaceholder={t('school.searchPlaceholder')}
        searchLabel={t('school.searchAriaLabel')}
        emptyMessage={t('school.empty')}
        getResultsMessage={(count) => t('school.resultsCount', { count })}
        getFocusAfterSelect={() => (isNameValid ? submitButtonRef.current : nameInputRef.current)}
      />
      <Button
        ref={submitButtonRef}
        type="submit"
        aria-disabled={!canSubmit || isSearching}
        aria-describedby={hintId}
        className="py-5 w-full sm:col-span-2"
      >
        {t('submit')}
        <span aria-hidden="true" className="flex">
          <Icons.SearchIcon className="size-4" />
        </span>
      </Button>
      <p id={hintId} className="text-xs text-text-tertiary sm:col-span-2">
        {t('hint')}
      </p>
    </form>
  );
}
