import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useHero } from '@/app/(frontend)/[locale]/(landing)/hooks/useHero';
import { installMatchMedia } from '@/test/helpers/matchMedia';

describe('useHero', () => {
  it('types, holds, deletes, and wraps through phrases', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useHero(['abcd', 'xy']));

    expect(result.current.description).toBe('');
    act(() => vi.advanceTimersByTime(175));
    expect(result.current.description).toBe('a');
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(175));
    expect(result.current.description).toBe('abcd');
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(1925));
    expect(result.current.description).toBe('abcd');
    act(() => vi.advanceTimersByTime(75));
    act(() => vi.advanceTimersByTime(87.5));
    act(() => vi.advanceTimersByTime(87.5));
    act(() => vi.advanceTimersByTime(50));
    expect(result.current.description).toBe('ab');
    act(() => vi.advanceTimersByTime(37.5));
    act(() => vi.advanceTimersByTime(87.5));
    act(() => vi.advanceTimersByTime(87.5));
    act(() => vi.advanceTimersByTime(87.5));
    expect(result.current.description).toBe('');
    act(() => vi.advanceTimersByTime(912.5));
    act(() => vi.advanceTimersByTime(350));
    act(() => vi.advanceTimersByTime(137.5));
    expect(result.current.description).toBe('x');
    act(() => vi.advanceTimersByTime(212.5));
    act(() => vi.advanceTimersByTime(87.5));
    expect(result.current.description).toBe('xy');
    act(() => vi.advanceTimersByTime(262.5));
    act(() => vi.advanceTimersByTime(1637.5));
    expect(result.current.description).toBe('xy');
    act(() => vi.advanceTimersByTime(362.5));
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(175));
    act(() => vi.advanceTimersByTime(37.5));
    expect(result.current.description).toBe('a');
    expect(result.current.overviewRef.current).toBeNull();
  });

  it('shows the first phrase immediately with reduced motion', () => {
    vi.useFakeTimers();
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    const { result } = renderHook(() => useHero(['abcd', 'xy']));

    expect(result.current.description).toBe('abcd');
    expect(vi.getTimerCount()).toBe(0);
  });
});
