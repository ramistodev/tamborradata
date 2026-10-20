import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useChapterNav } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/hooks/useChapterNav';
import { scrollToChapter } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToChapter';
import { makeFamily } from '@/test/fixtures/statistics';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToChapter', () => ({ scrollToChapter: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({ scrollToActiveElement: vi.fn() }));

describe('useChapterNav', () => {
  it('builds chapter ids and delegates jumps from the nearest nav', () => {
    const families = [makeFamily('names', []), makeFamily('schools', [])];
    const { result } = renderHook(() => useChapterNav({ families }));
    expect(result.current.chapterIds).toEqual(['hero', 'names', 'schools', 'closing']);
    expect(result.current.activeId).toBe('hero');
    const nav = document.createElement('nav');
    const preventDefault = vi.fn();
    const closest = vi.fn(() => nav);
    result.current.jumpTo({ preventDefault, currentTarget: { closest } } as never, 'names');
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(closest).toHaveBeenCalledWith('nav');
    expect(scrollToChapter).toHaveBeenCalledWith('names', nav);
  });

  it('keeps only boundary chapters without families', () => {
    const { result } = renderHook(() => useChapterNav({ families: [] }));
    expect(result.current.chapterIds).toEqual(['hero', 'closing']);
  });
});
