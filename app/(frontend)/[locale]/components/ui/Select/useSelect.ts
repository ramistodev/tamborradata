'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { SelectOption } from './types';

type UseSelectParams = {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  searchable?: boolean;
  disabled?: boolean;
};

/** Lowercase + strip accents so "Ikastola" matches "ikástola". */
function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function nextEnabledIndex(options: SelectOption[], from: number, step: 1 | -1) {
  for (let i = from + step; i >= 0 && i < options.length; i += step) {
    if (!options[i].disabled) return i;
  }
  return from;
}

function firstEnabledIndex(options: SelectOption[]) {
  return options.findIndex((option) => !option.disabled);
}

function lastEnabledIndex(options: SelectOption[]) {
  for (let i = options.length - 1; i >= 0; i--) {
    if (!options[i].disabled) return i;
  }
  return -1;
}

/**
 * State and behavior of an accessible select (APG "combobox" pattern):
 * open/close, text filter, keyboard navigation, click outside and focus management.
 */
export function useSelect({ options, value, onChange, searchable, disabled }: UseSelectParams) {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return options;
    return options.filter((option) => normalize(option.label).includes(normalizedQuery));
  }, [options, query]);

  const open = useCallback(() => {
    if (disabled) return;
    const selectedIndex = filtered.findIndex((option) => option.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex(filtered));
    setIsOpen(true);
  }, [disabled, filtered, value]);

  const close = useCallback((returnFocus = false) => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const select = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      onChange(option.value);
      close(true);
    },
    [onChange, close]
  );

  // Click outside closes the panel
  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close();
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, close]);

  // Focus the filter input when opening a searchable select
  useEffect(() => {
    if (isOpen && searchable) searchRef.current?.focus();
  }, [isOpen, searchable]);

  // Keep the active option visible while navigating with the keyboard
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[id="${optionId(activeIndex)}"]`)
      ?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    const normalizedQuery = normalize(nextQuery);
    const nextFiltered = normalizedQuery
      ? options.filter((option) => normalize(option.label).includes(normalizedQuery))
      : options;
    setActiveIndex(firstEnabledIndex(nextFiltered));
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled) return;
    const isSearchInput = event.target === searchRef.current;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) return open();
        setActiveIndex((index) => nextEnabledIndex(filtered, index, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) return open();
        setActiveIndex((index) => nextEnabledIndex(filtered, index, -1));
        break;
      case 'Home':
        if (!isOpen || isSearchInput) return;
        event.preventDefault();
        setActiveIndex(firstEnabledIndex(filtered));
        break;
      case 'End':
        if (!isOpen || isSearchInput) return;
        event.preventDefault();
        setActiveIndex(lastEnabledIndex(filtered));
        break;
      case 'Enter':
        event.preventDefault();
        if (!isOpen) return open();
        if (filtered[activeIndex]) select(filtered[activeIndex]);
        break;
      case ' ':
        // In the filter input the space is a character; on the trigger it opens/selects
        if (isSearchInput) return;
        event.preventDefault();
        if (!isOpen) return open();
        if (filtered[activeIndex]) select(filtered[activeIndex]);
        break;
      case 'Escape':
        if (!isOpen) return;
        event.preventDefault();
        close(true);
        break;
      case 'Tab':
        if (isOpen) close();
        break;
    }
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  return {
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
    setActiveIndex,
    toggle,
    select,
    handleKeyDown,
    handleQueryChange,
  };
}
