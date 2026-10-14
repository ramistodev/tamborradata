import { useId } from 'react';
import type { FormEvent, RefObject } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../../../components/Icons';
import { Button, Input, Select } from '../../../components/ui';
import type { SelectOption } from '../../../components/ui';

type SearchFormProps = {
  name: string;
  onNameChange: (name: string) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
  schoolKey: string | null;
  onSchoolChange: (schoolKey: string) => void;
  schoolOptions: SelectOption[];
  isNameValid: boolean;
  canSubmit: boolean;
  isSearching: boolean;
  onSubmit: (event: FormEvent) => void;
};

export function SearchForm({
  name,
  onNameChange,
  nameInputRef,
  schoolKey,
  onSchoolChange,
  schoolOptions,
  isNameValid,
  canSubmit,
  isSearching,
  onSubmit,
}: SearchFormProps) {
  const t = useTranslations('Search.form');
  const id = useId();
  const hintId = `${id}-hint`;
  const schoolId = `${id}-school`;

  // The button is `aria-disabled` (not `disabled`) so it stays in the tab order and keeps focus
  // while a search runs; the handler does what `disabled` would have done
  function handleSubmit(event: FormEvent) {
    if (isSearching) {
      event.preventDefault();
      return;
    }

    if (!canSubmit) {
      event.preventDefault();
      if (isNameValid) document.getElementById(schoolId)?.focus();
      else nameInputRef.current?.focus();
      return;
    }

    onSubmit(event);
  }

  return (
    <form
      role="search"
      aria-label={t('ariaLabel')}
      onSubmit={handleSubmit}
      className="flex flex-col md:grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[3fr_2fr] sm:p-5"
    >
      <Input
        ref={nameInputRef}
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
      />
      <Button
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
