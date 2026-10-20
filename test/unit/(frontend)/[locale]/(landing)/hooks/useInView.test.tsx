import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInView } from '@/app/(frontend)/[locale]/(landing)/hooks/useInView';
import { MockIntersectionObserver } from '@/test/helpers/observers';

describe('useInView', () => {
  it('observes until the element intersects', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { result } = renderHook(() => useInView({ ref }));
    const io = MockIntersectionObserver.instances[0];

    expect(result.current.isInView).toBe(false);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(io.options).toEqual({ threshold: 0.2 });
    expect(io.observed.has(element)).toBe(true);
    act(() => io.trigger(false));
    expect(result.current.isInView).toBe(false);
    act(() => io.trigger(true, element));
    expect(result.current.isInView).toBe(true);
    expect(io.observed.size).toBe(0);
  });

  it('accepts a custom threshold', () => {
    const ref = { current: document.createElement('div') };

    renderHook(() => useInView({ ref, threshold: 0.5 }));

    expect(MockIntersectionObserver.instances[0].options).toEqual({ threshold: 0.5 });
  });

  it('does not create an observer without an element', () => {
    renderHook(() => useInView({ ref: { current: null } }));

    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it('disconnects when unmounted before intersection', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useInView({ ref }));
    const io = MockIntersectionObserver.instances[0];
    const disconnect = vi.spyOn(io, 'disconnect');

    unmount();

    expect(disconnect).toHaveBeenCalledOnce();
  });
});
