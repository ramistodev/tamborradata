import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAnimatedProgress } from '@/app/(frontend)/[locale]/(landing)/hooks/useAnimatedProgress';
import { installMatchMedia } from '@/test/helpers/matchMedia';

describe('useAnimatedProgress', () => {
  it('stays idle without creating a timer while inactive', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAnimatedProgress({ active: false, duration: 1000 }));

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current.progress).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('advances to one and clears its interval', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAnimatedProgress({ active: true, duration: 1000 }));

    act(() => vi.advanceTimersByTime(250));
    expect(result.current.progress).toBe(0.25);
    act(() => vi.advanceTimersByTime(250));
    expect(result.current.progress).toBe(0.5);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.progress).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.progress).toBe(1);
  });

  it('uses the supplied duration', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAnimatedProgress({ active: true, duration: 2000 }));

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.progress).toBe(0.5);
  });

  it('starts from zero when activated and cleans up on unmount', () => {
    vi.useFakeTimers();
    const { result, rerender, unmount } = renderHook(
      ({ active }) => useAnimatedProgress({ active, duration: 1000 }),
      { initialProps: { active: false } },
    );

    rerender({ active: true });
    expect(result.current.progress).toBe(0);
    act(() => vi.advanceTimersByTime(50));
    expect(result.current.progress).toBe(0.05);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('finishes immediately when reduced motion is requested', () => {
    vi.useFakeTimers();
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    const { result } = renderHook(() => useAnimatedProgress({ active: true, duration: 1000 }));

    expect(result.current.progress).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
