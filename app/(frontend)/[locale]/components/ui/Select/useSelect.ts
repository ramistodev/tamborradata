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
  /** Where focus goes after an option is chosen. Without it, or when it returns `null`, the trigger. */
  getFocusAfterSelect?: () => HTMLElement | null;
};

/** Space kept above the select when it is scrolled to the top of the viewport. */
const SCROLL_TOP_OFFSET = 100;
/** Typed characters stay in the type-ahead buffer this long. */
const TYPEAHEAD_RESET_MS = 500;

/** Lowercase + strip accents so "Ikastola" matches "ikastola". */
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
export function useSelect({
  options,
  value,
  onChange,
  searchable,
  disabled,
  getFocusAfterSelect,
}: UseSelectParams) {
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
  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({ buffer: '' });

  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

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
      close();
      (getFocusAfterSelect?.() ?? triggerRef.current)?.focus();
    },
    [onChange, close, getFocusAfterSelect]
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

  // Focus the filter input when opening a searchable select. The scroll is handled by the
  // effect below, so the browser's own scroll-into-view must not fight with it.
  useEffect(() => {
    const input = searchRef.current;
    if (!isOpen || !searchable || !input) return;
    input.focus({ preventScroll: true });
    // Opened by typing: the filter already holds a character, so the caret goes after it
    input.setSelectionRange(input.value.length, input.value.length);
  }, [isOpen, searchable]);

  // Bring the select to the top while it is open (so the panel stays clear of the on-screen
  // keyboard) and restore the previous scroll position when it closes. Only touch screens have
  // that keyboard: with a mouse or keyboard the page must not move on its own.
  useEffect(() => {
    if (!isOpen) return;
    const root = rootRef.current;
    if (!root || !window.matchMedia('(pointer: coarse)').matches) return;

    const previousScroll = window.scrollY;
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    const frame = requestAnimationFrame(() => {
      const top = previousScroll + root.getBoundingClientRect().top - SCROLL_TOP_OFFSET;
      window.scrollTo({ top, behavior });
    });

    return () => {
      cancelAnimationFrame(frame);
      window.scrollTo({ top: previousScroll, behavior });
    };
  }, [isOpen]);

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

  // Select-only combobox: typing letters jumps to the next option that starts with them
  function handleTypeahead(character: string) {
    const state = typeahead.current;
    clearTimeout(state.timer);
    state.buffer += character;
    state.timer = setTimeout(() => {
      state.buffer = '';
    }, TYPEAHEAD_RESET_MS);

    const term = normalize(state.buffer);
    const start = state.buffer.length > 1 ? Math.max(activeIndex, 0) : activeIndex + 1;

    for (let offset = 0; offset < filtered.length; offset++) {
      const index = (start + offset) % filtered.length;
      const option = filtered[index];

      if (!option.disabled && normalize(option.label).startsWith(term)) {
        if (!isOpen) open();
        setActiveIndex(index);
        return;
      }
    }
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
        // From the filter input, focus goes back to the trigger first, so Tab continues from it
        // instead of from an input that is about to unmount
        if (!isOpen) break;
        // Select-only combobox: Tab keeps the highlighted option, like the APG pattern
        if (!searchable && filtered[activeIndex] && !filtered[activeIndex].disabled) {
          onChange(filtered[activeIndex].value);
        }
        close(isSearchInput);
        break;
      default: {
        const isCharacter = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
        if (!isCharacter) break;
        if (!searchable) {
          handleTypeahead(event.key);
        } else if (!isOpen && !isSearchInput) {
          // Typing on the closed trigger opens the panel with that character already in the filter.
          // The default action is cancelled, otherwise the focus move would type it a second time.
          event.preventDefault();
          open();
          handleQueryChange(event.key);
        }
      }
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
