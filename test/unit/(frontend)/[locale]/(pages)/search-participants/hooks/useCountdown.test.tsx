import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCountdown } from '@/app/(frontend)/[locale]/(pages)/search-participants/hooks/useCountdown';

const NOW = new Date('2026-03-10T12:00:00.000Z');

describe('useCountdown', () => {
  it('counts down against its deadline and clears at zero', () => {
    vi.useFakeTimers({ now: NOW });
    const { result } = renderHook(() => useCountdown(90));
    expect(result.current).toBe(90);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(89);
    act(() => vi.advanceTimersByTime(89000));
    expect(result.current).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current).toBe(0);
  });

  it('uses wall-clock time after one large jump', () => {
    vi.useFakeTimers({ now: NOW });
    const { result } = renderHook(() => useCountdown(90));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current).toBe(85);
  });

  it('rounds fractional positive seconds up', () => {
    vi.useFakeTimers({ now: NOW });
    const { result } = renderHook(() => useCountdown(1.2));
    expect(result.current).toBe(2);
  });

  it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])('starts at zero for %s', (seconds) => {
    vi.useFakeTimers({ now: NOW });
    const { result } = renderHook(() => useCountdown(seconds));
    expect(result.current).toBe(0);
  });

  it('clears its interval on unmount', () => {
    vi.useFakeTimers({ now: NOW });
    const { unmount } = renderHook(() => useCountdown(90));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
