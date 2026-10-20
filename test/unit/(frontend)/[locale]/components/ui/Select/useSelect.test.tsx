import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSelect } from '@/app/(frontend)/[locale]/components/ui/Select/useSelect';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Árbol' },
];
const keyTarget = document.createElement('button');
const key = (value: string, extra = {}) =>
  ({
    key: value, preventDefault: vi.fn(), target: keyTarget, ctrlKey: false, metaKey: false, altKey: false, ...extra,
  }) as unknown as KeyboardEvent;

function setup(overrides: Partial<Parameters<typeof useSelect>[0]> = {}) {
  const onChange = vi.fn();
  const hook = renderHook(() => useSelect({ options, value: null, onChange, ...overrides }));
  return { ...hook, onChange };
}

describe('useSelect', () => {
  it('exposes its initial selection and generated ids', () => {
    expect(setup().result.current.selected).toBeNull();
    const { result } = setup({ value: 'c' });

    expect(result.current).toMatchObject({ isOpen: false, query: '', activeIndex: -1 });
    expect(result.current.selected?.label).toBe('Gamma');
    expect(result.current.optionId(2)).toMatch(/-option-2$/);
    expect(result.current.listboxId).toMatch(/-listbox$/);
  });

  it('opens at the selected or first enabled option and resets when closed', () => {
    const selected = setup({ value: 'c' });
    act(() => selected.result.current.toggle());
    expect(selected.result.current.activeIndex).toBe(2);
    act(() => selected.result.current.handleQueryChange('gam'));
    act(() => selected.result.current.toggle());
    expect(selected.result.current).toMatchObject({ isOpen: false, query: '', activeIndex: -1 });

    const empty = setup();
    act(() => empty.result.current.toggle());
    expect(empty.result.current.activeIndex).toBe(0);
  });

  it('navigates enabled options without wrapping', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    for (const [pressed, expected] of [['ArrowDown', 2], ['ArrowDown', 3], ['ArrowDown', 3], ['ArrowUp', 2], ['ArrowUp', 0]] as const) {
      const event = key(pressed);
      act(() => result.current.handleKeyDown(event));
      expect(result.current.activeIndex).toBe(expected);
      expect(event.preventDefault).toHaveBeenCalledOnce();
    }
    for (const [pressed, expected] of [['End', 3], ['Home', 0]] as const) {
      const event = key(pressed);
      act(() => result.current.handleKeyDown(event));
      expect(result.current.activeIndex).toBe(expected);
      expect(event.preventDefault).toHaveBeenCalledOnce();
    }
  });

  it('ignores Home and End while closed', () => {
    const { result } = setup();
    const home = key('Home');
    const end = key('End');
    act(() => result.current.handleKeyDown(home));
    act(() => result.current.handleKeyDown(end));
    expect(result.current.isOpen).toBe(false);
    expect(home.preventDefault).not.toHaveBeenCalled();
    expect(end.preventDefault).not.toHaveBeenCalled();
  });

  it.each(['ArrowDown', 'ArrowUp', 'Enter', ' '])('opens on %s while closed', (pressed) => {
    const { result } = setup();
    const event = key(pressed);

    act(() => result.current.handleKeyDown(event));

    expect(result.current.isOpen).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledOnce();
  });

  it('selects with Enter and closes with Escape', () => {
    const { result, onChange } = setup();
    act(() => result.current.toggle());
    act(() => result.current.handleKeyDown(key('Enter')));
    expect(onChange).toHaveBeenCalledWith('a');
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    act(() => result.current.handleKeyDown(key('Escape')));
    expect(result.current.isOpen).toBe(false);
  });

  it('commits the active option on Tab only when not searchable', () => {
    const plain = setup();
    act(() => plain.result.current.toggle());
    act(() => plain.result.current.handleKeyDown(key('Tab')));
    expect(plain.onChange).toHaveBeenCalledWith('a');
    expect(plain.result.current.isOpen).toBe(false);

    const searchable = setup({ searchable: true });
    act(() => searchable.result.current.toggle());
    act(() => searchable.result.current.handleKeyDown(key('Tab')));
    expect(searchable.onChange).not.toHaveBeenCalled();
    expect(searchable.result.current.isOpen).toBe(false);
  });

  it('selects enabled options and moves focus to the requested element', () => {
    const target = document.createElement('button');
    document.body.append(target);
    const { result, onChange } = setup({ getFocusAfterSelect: () => target });
    act(() => result.current.toggle());
    act(() => result.current.select(options[1]));
    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.select(options[2]));
    expect(onChange).toHaveBeenCalledWith('c');
    expect(result.current.isOpen).toBe(false);
    expect(document.activeElement).toBe(target);
  });

  it('does nothing while disabled', () => {
    const { result, onChange } = setup({ disabled: true });
    const event = key('ArrowDown');
    act(() => result.current.toggle());
    act(() => result.current.handleKeyDown(event));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeIndex).toBe(-1);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('filters accent-insensitively and resets the active option', () => {
    const { result } = setup({ searchable: true });
    act(() => result.current.handleQueryChange('arb'));
    expect(result.current.query).toBe('arb');
    expect(result.current.filtered).toEqual([options[3]]);
    expect(result.current.activeIndex).toBe(0);
    act(() => result.current.handleQueryChange('xyz'));
    expect(result.current.filtered).toEqual([]);
    expect(result.current.activeIndex).toBe(-1);
    act(() => result.current.handleQueryChange(''));
    expect(result.current.filtered).toEqual(options);
  });

  it('supports typeahead and ignores modified characters', () => {
    vi.useFakeTimers();
    const { result } = setup();
    act(() => result.current.handleKeyDown(key('g')));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activeIndex).toBe(2);
    const modified = key('a', { ctrlKey: true });
    act(() => result.current.handleKeyDown(modified));
    expect(result.current.activeIndex).toBe(2);
    expect(modified.preventDefault).not.toHaveBeenCalled();
  });

  it('opens a searchable select with the typed query', () => {
    const { result } = setup({ searchable: true });
    const event = key('g');
    act(() => result.current.handleKeyDown(event));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.query).toBe('g');
    expect(event.preventDefault).toHaveBeenCalledOnce();
  });
});
