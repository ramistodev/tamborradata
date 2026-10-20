import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useCategoryGroup } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/hooks/useCategoryGroup';
import { scrollToActiveElement } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement';
import { makeRanksCategory } from '@/test/fixtures/statistics';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({ scrollToActiveElement: vi.fn() }));

const categories = [
  makeRanksCategory('topNames'),
  makeRanksCategory('topSecondNames'),
  makeRanksCategory('newNames'),
];
const key = (value: string) =>
  ({ key: value, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLButtonElement>;

describe('useCategoryGroup', () => {
  it('selects and focuses a tab with stable aria ids', () => {
    const { result } = renderHook(() => useCategoryGroup(categories));
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.tabId(1)).toMatch(/-tab-1$/);
    expect(result.current.panelId(1)).toMatch(/-panel-1$/);
    const button = document.createElement('button');
    button.id = result.current.tabId(2);
    document.body.append(button);
    act(() => result.current.selectTab(2));
    expect(result.current.activeIndex).toBe(2);
    expect(document.activeElement).toBe(button);
    expect(scrollToActiveElement).toHaveBeenCalledWith(null, button, 'smooth');
  });

  it('handles wrapping arrow and boundary keys', () => {
    const { result } = renderHook(() => useCategoryGroup(categories));
    for (const [pressed, from, expected] of [
      ['ArrowRight', 2, 0], ['ArrowLeft', 0, 2], ['ArrowRight', 0, 1], ['Home', 2, 0], ['End', 0, 2],
    ] as const) {
      const event = key(pressed);
      act(() => result.current.handleKeyDown(event, from));
      expect(result.current.activeIndex).toBe(expected);
      expect(event.preventDefault).toHaveBeenCalledOnce();
    }
    const ignored = key('a');
    act(() => result.current.handleKeyDown(ignored, 0));
    expect(ignored.preventDefault).not.toHaveBeenCalled();
  });

  it('handles empty categories and exposes index zero when an active key disappears', () => {
    const empty = renderHook(() => useCategoryGroup([]));
    expect(empty.result.current.activeIndex).toBe(0);
    const { result, rerender } = renderHook(({ value }) => useCategoryGroup(value), {
      initialProps: { value: categories },
    });
    act(() => result.current.selectTab(2));
    expect(result.current.activeIndex).toBe(2);
    rerender({ value: categories.slice(0, 2) });
    expect(result.current.activeIndex).toBe(0);
  });
});
