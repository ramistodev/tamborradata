'use client';
import { type Ref, useCallback, useId, useState } from 'react';
import { Icons } from '../../Icons';
import { fieldBorderStyles, fieldStyles } from '../Input';
import { Skeleton } from '../Skeleton';
import type { SelectOption } from './types';
import { useSelect } from './useSelect';

type SelectProps = {
  options: SelectOption[];
  /** Controlled value. Omit it (and use `defaultValue`) for an uncontrolled select. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  placeholder: string;
  label?: string;
  /** Accessible name of the trigger when there is no visible `label`. */
  ariaLabel?: string;
  /** `id` of the trigger, so a form can focus it. */
  id?: string;
  /** `id`s of the elements that describe the trigger (hints, errors). */
  describedBy?: string;
  /** Submits the selected value in native forms. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  /**
   * Adds a filter field. The trigger is then a plain popup button, and the filter field (inside the
   * popup) is the only combobox, so a screen reader never meets two of them for one control.
   */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Accessible name of the filter field. Falls back to `searchPlaceholder`. */
  searchLabel?: string;
  emptyMessage?: string;
  /** Spoken (polite live region) while filtering, e.g. "3 schools found". */
  getResultsMessage?: (count: number) => string;
  /** Element that takes focus once an option is chosen; the trigger when omitted or `null`. */
  getFocusAfterSelect?: () => HTMLElement | null;
  className?: string;
  /** Ref to the trigger button, e.g. to return focus to it. */
  ref?: Ref<HTMLButtonElement>;
};

const LOADING_ROWS = 6;

export function Select({
  options,
  value: controlledValue,
  defaultValue = null,
  onChange,
  placeholder,
  label,
  ariaLabel,
  id,
  describedBy,
  name,
  required,
  disabled,
  isLoading,
  searchable,
  searchPlaceholder,
  searchLabel,
  emptyMessage,
  getResultsMessage,
  getFocusAfterSelect,
  className = '',
  ref,
}: SelectProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const hiddenNameId = `${baseId}-name`;
  const valueId = `${baseId}-value`;
  const panelId = `${baseId}-panel`;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  function handleChange(nextValue: string) {
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  }

  const select = useSelect({
    options,
    value,
    onChange: handleChange,
    searchable,
    disabled,
    getFocusAfterSelect,
  });
  const {
    rootRef,
    triggerRef,
    searchRef,
    listRef,
    listboxId,
    optionId,
    isOpen,
    query,
    activeIndex,
    selected,
    filtered,
  } = select;

  // The trigger needs both the hook's internal ref (focus return) and the caller's ref
  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [triggerRef, ref]
  );

  const activeDescendant = isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined;
  const nameSourceId = label ? labelId : ariaLabel ? hiddenNameId : undefined;
  // A searchable trigger is a plain button: its name is the label followed by the chosen value
  const triggerLabelledBy = searchable
    ? [nameSourceId, selected ? valueId : undefined].filter(Boolean).join(' ') || undefined
    : nameSourceId;
  const hasListbox = Boolean(isLoading) || filtered.length > 0;
  const controlledId = searchable ? panelId : hasListbox ? listboxId : undefined;
  const resultsMessage =
    searchable && isOpen && query.trim() && !isLoading
      ? filtered.length === 0
        ? (emptyMessage ?? getResultsMessage?.(0) ?? '')
        : (getResultsMessage?.(filtered.length) ?? '')
      : '';

  return (
    <div ref={rootRef} className={`relative flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <span id={labelId} className="text-sm font-semibold text-text">
          {label}
        </span>
      )}
      {!label && ariaLabel && (
        <span id={hiddenNameId} hidden>
          {ariaLabel}
        </span>
      )}

      <button
        ref={setTriggerRef}
        id={id}
        type="button"
        role={searchable ? undefined : 'combobox'}
        aria-haspopup={searchable ? 'dialog' : 'listbox'}
        aria-expanded={isOpen}
        aria-controls={isOpen ? controlledId : undefined}
        aria-labelledby={triggerLabelledBy}
        aria-describedby={describedBy}
        aria-required={searchable ? undefined : required}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        disabled={disabled}
        onClick={select.toggle}
        onKeyDown={select.handleKeyDown}
        className={`flex cursor-pointer items-center justify-between gap-2 text-left ${fieldStyles} ${fieldBorderStyles} ${isOpen ? 'border-accent!' : ''}`}
      >
        <span
          id={valueId}
          className={`min-w-0 wrap-break-word ${selected ? 'font-semibold text-text' : 'text-text-tertiary'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <Icons.ChevronDown
          className={`size-3.5 text-text-secondary transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {resultsMessage}
      </div>

      {/*
       * Mirrors the value for native forms. Neither type="hidden" nor readOnly can be used:
       * both are barred from constraint validation, so `required` would be ignored.
       */}
      {name && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          name={name}
          value={value ?? ''}
          onChange={() => {}}
          required={required}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0"
        />
      )}

      {isOpen && (
        <div
          id={panelId}
          role={searchable ? 'dialog' : undefined}
          aria-labelledby={searchable ? nameSourceId : undefined}
          aria-label={searchable && !nameSourceId ? placeholder : undefined}
          className="absolute inset-x-0 top-full z-50 mt-1.5 flex max-h-[min(300px,50vh)] animate-drop-in flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_32px_rgba(0,0,0,0.22)] motion-reduce:animate-none"
        >
          {searchable && (
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-3.5 py-2.5">
              <span aria-hidden="true" className="flex">
                <Icons.SearchIcon className="size-4 text-text-tertiary" />
              </span>
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={hasListbox ? listboxId : undefined}
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                aria-label={searchLabel ?? searchPlaceholder ?? placeholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event) => select.handleQueryChange(event.target.value)}
                onKeyDown={select.handleKeyDown}
                className="min-w-0 flex-1 bg-transparent font-sans text-base text-text outline-hidden placeholder:text-text-tertiary"
              />
            </div>
          )}

          {hasListbox ? (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={nameSourceId}
              aria-busy={isLoading}
              className="flex-1 overflow-y-auto overscroll-contain py-1.5 scrollbar-thin"
            >
              {isLoading
                ? Array.from({ length: LOADING_ROWS }, (_, index) => (
                    <li key={index} role="presentation" className="px-3.5 py-2.25">
                      <Skeleton className="h-4 w-3/4" />
                    </li>
                  ))
                : filtered.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === activeIndex;
                    const tone = isActive
                      ? 'bg-bg-hover font-semibold text-text'
                      : isSelected
                        ? 'font-semibold text-text'
                        : 'text-text-secondary';

                    return (
                      <li
                        key={option.value}
                        id={optionId(index)}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseMove={() => !option.disabled && select.setActiveIndex(index)}
                        onClick={() => select.select(option)}
                        className={`mx-1.5 flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2.25 font-sans text-[13.5px] transition-colors duration-100 motion-reduce:transition-none ${tone} ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <span className="min-w-0 wrap-break-word">{option.label}</span>
                        {isSelected && <Icons.CheckMark className="size-3.5 text-accent" />}
                      </li>
                    );
                  })}
            </ul>
          ) : (
            emptyMessage && (
              <p className="px-3.5 py-3 text-[13px] text-text-secondary">{emptyMessage}</p>
            )
          )}
        </div>
      )}
    </div>
  );
}
