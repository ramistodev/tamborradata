import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePrefersReducedMotion } from '@/app/(frontend)/[locale]/(landing)/hooks/usePrefersReducedMotion';
import { installMatchMedia } from '@/test/helpers/matchMedia';

const QUERY = '(prefers-reduced-motion: reduce)';

describe('usePrefersReducedMotion', () => {
  it('is false by default', () => {
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it('reads an initial matching query', () => {
    installMatchMedia({ [QUERY]: true });

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it('reacts to changes and removes its listener on unmount', () => {
    const media = installMatchMedia();
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());

    expect(media.listenerCount(QUERY)).toBe(1);
    act(() => media.setMatches(QUERY, true));
    expect(result.current).toBe(true);
    act(() => media.setMatches(QUERY, false));
    expect(result.current).toBe(false);
    unmount();
    expect(media.listenerCount(QUERY)).toBe(0);
  });
});
