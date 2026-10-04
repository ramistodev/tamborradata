'use client';
import { useId, useState } from 'react';
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
  /** Submits the selected value in native forms. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
};

const LOADING_ROWS = 6;

export function Select({
  options,
  value: controlledValue,
  defaultValue = null,
  onChange,
  placeholder,
  label,
  name,
  required,
  disabled,
  isLoading,
  searchable,
  searchPlaceholder,
  emptyMessage,
  className = '',
}: SelectProps) {
  const labelId = useId();
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  function handleChange(nextValue: string) {
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  }

  const select = useSelect({ options, value, onChange: handleChange, searchable, disabled });
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

  const activeDescendant = isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined;

  return (
    <div ref={rootRef} className={`relative flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <span id={labelId} className="text-sm font-semibold text-text">
          {label}
        </span>
      )}

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        aria-required={required}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        disabled={disabled}
        onClick={select.toggle}
        onKeyDown={select.handleKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border bg-bg px-3.5 py-2.75 text-left font-sans text-[14.5px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ${isOpen ? 'border-accent' : 'border-border hover:border-border-strong'}`}
      >
        <span className={`truncate ${selected ? 'text-text' : 'text-text-tertiary'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-text-secondary transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

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
        <div className="absolute inset-x-0 top-full z-50 mt-1 flex max-h-[min(260px,50vh)] animate-drop-in flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-[0_8px_32px_rgba(0,0,0,0.22)] motion-reduce:animate-none">
          {searchable && (
            <div className="shrink-0 border-b border-border px-2.5 py-2">
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                aria-label={searchPlaceholder ?? placeholder}
                autoComplete="off"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event) => select.handleQueryChange(event.target.value)}
                onKeyDown={select.handleKeyDown}
                className="w-full rounded-lg border border-border bg-bg px-2.5 py-1.75 font-sans text-[13px] text-text outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
              />
            </div>
          )}

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            aria-busy={isLoading}
            className="flex-1 overflow-y-auto py-1"
          >
            {isLoading
              ? Array.from({ length: LOADING_ROWS }, (_, index) => (
                  <li key={index} role="presentation" className="px-3.5 py-2.25">
                    <Skeleton className="h-4 w-3/4" />
                  </li>
                ))
              : filtered.length === 0
                ? emptyMessage && (
                    <li role="presentation" className="px-3.5 py-3 text-[13px] text-text-secondary">
                      {emptyMessage}
                    </li>
                  )
                : filtered.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === activeIndex;

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
                        className={`flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.25 font-sans text-[13.5px] transition-colors duration-100 ${isSelected ? 'bg-bg-hover text-accent' : 'text-text'} ${isActive && !isSelected ? 'bg-bg-secondary' : ''} ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <span className="min-w-0 wrap-break-word">{option.label}</span>
                        {isSelected && (
                          <svg
                            aria-hidden="true"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </li>
                    );
                  })}
          </ul>
        </div>
      )}
    </div>
  );
}
