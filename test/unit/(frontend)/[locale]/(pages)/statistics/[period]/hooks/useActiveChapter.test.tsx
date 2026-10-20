import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useActiveChapter } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/hooks/useActiveChapter';
import { scrollToActiveElement } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement';
import { MockIntersectionObserver } from '@/test/helpers/observers';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({ scrollToActiveElement: vi.fn() }));

function addSections() {
  for (const id of ['hero', 'names', 'closing']) {
    const section = document.createElement('section');
    section.id = id;
    document.body.append(section);
  }
}

describe('useActiveChapter', () => {
  afterEach(() => document.querySelectorAll('section').forEach((section) => section.remove()));

  it('observes existing sections and selects the topmost intersection', () => {
    addSections();
    const { result } = renderHook(() => useActiveChapter(['hero', 'missing', 'names', 'closing']));
    const io = MockIntersectionObserver.instances[0];
    expect(result.current.activeId).toBe('hero');
    expect(io.options.rootMargin).toBe('-140px 0px -60% 0px');
    expect([...io.observed].map((element) => element.id)).toEqual(['hero', 'names', 'closing']);
    expect(scrollToActiveElement).toHaveBeenCalledTimes(1);
    act(() => io.triggerMany([{ target: document.getElementById('closing')!, isIntersecting: false, top: 1 }]));
    expect(result.current.activeId).toBe('hero');
    act(() => io.triggerMany([
      { target: document.getElementById('closing')!, isIntersecting: true, top: 500 },
      { target: document.getElementById('names')!, isIntersecting: true, top: 100 },
    ]));
    expect(result.current.activeId).toBe('names');
    expect(scrollToActiveElement).toHaveBeenCalledTimes(2);
    expect(scrollToActiveElement).toHaveBeenLastCalledWith(null, null, 'smooth');
  });

  it('re-observes changed ids and disconnects on unmount', () => {
    addSections();
    const { result, rerender, unmount } = renderHook(({ ids }) => useActiveChapter(ids), {
      initialProps: { ids: ['hero', 'names'] },
    });
    const first = MockIntersectionObserver.instances[0];
    rerender({ ids: ['names', 'closing'] });
    expect(first.observed.size).toBe(0);
    expect([...MockIntersectionObserver.instances[1].observed].map((element) => element.id)).toEqual(['names', 'closing']);
    expect(result.current.containerRef.current).toBeNull();
    expect(result.current.activeRef.current).toBeNull();
    const second = MockIntersectionObserver.instances[1];
    unmount();
    expect(second.observed.size).toBe(0);
  });
});
