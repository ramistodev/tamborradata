import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useChangeLocale } from '@/app/(frontend)/i18n/useChangeLocale';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderHookWithIntl } from '@/test/helpers/renderWithIntl';

const PENDING_HASH_KEY = 'pendingLocaleHash';

function pendingHash() {
  const stored = window.sessionStorage.getItem(PENDING_HASH_KEY);
  return stored ? JSON.parse(stored) : null;
}

describe('useChangeLocale', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, '', '/statistics/2024?x=1#sec');
    navigationState.pathname = '/statistics/2024';
  });

  it('keeps the search and defers the hash while changing locale', () => {
    const { result } = renderHookWithIntl(() => useChangeLocale(), { locale: 'es' });
    expect(result.current.locale).toBe('es');
    expect(result.current.isPending).toBe(false);

    act(() => result.current.changeLocale('en'));

    expect(navigationState.router.replace).toHaveBeenCalledOnce();
    const [englishPath, englishOptions] = navigationState.router.replace.mock.calls[0];
    expect(englishPath).toBe('/en/statistics/2024?x=1');
    expect(englishOptions).toEqual({ scroll: false });
    expect(pendingHash()).toEqual({ href: '/en/statistics/2024?x=1', hash: '#sec' });
  });

  it('builds a Basque path and ignores the current locale', () => {
    const { result } = renderHookWithIntl(() => useChangeLocale(), { locale: 'es' });
    act(() => result.current.changeLocale('eu'));
    expect(navigationState.router.replace.mock.calls[0][0]).toBe('/eu/statistics/2024?x=1');
    navigationState.router.replace.mockClear();
    act(() => result.current.changeLocale('es'));
    expect(navigationState.router.replace).not.toHaveBeenCalled();
  });

  it('routes back to Spanish without the locale prefix', () => {
    window.history.replaceState(null, '', '/en/statistics/2024?x=1#sec');
    navigationState.pathname = '/en/statistics/2024';
    const { result } = renderHookWithIntl(() => useChangeLocale(), { locale: 'en' });
    act(() => result.current.changeLocale('es'));
    // A `/es` prefix would be redirected to the unprefixed URL and the redirect drops the hash.
    const [path, options] = navigationState.router.replace.mock.calls[0];
    expect(path).toBe('/statistics/2024?x=1');
    expect(options).toEqual({ scroll: false });
    expect(pendingHash()).toEqual({ href: '/statistics/2024?x=1', hash: '#sec' });
  });

  it('keeps the root path when switching between locales', () => {
    window.history.replaceState(null, '', '/en');
    navigationState.pathname = '/en';
    const { result } = renderHookWithIntl(() => useChangeLocale(), { locale: 'en' });
    act(() => result.current.changeLocale('es'));
    expect(navigationState.router.replace.mock.calls[0][0]).toBe('/');
    navigationState.router.replace.mockClear();
    act(() => result.current.changeLocale('eu'));
    expect(navigationState.router.replace.mock.calls[0][0]).toBe('/eu');
  });

  it('does not store anything when the URL has no hash', () => {
    window.history.replaceState(null, '', '/statistics/2024?x=1');
    const { result } = renderHookWithIntl(() => useChangeLocale(), { locale: 'es' });
    act(() => result.current.changeLocale('en'));
    expect(pendingHash()).toBeNull();
  });

  describe('once the new locale has rendered', () => {
    it('puts the hash back on the page the switch was heading to', () => {
      const first = renderHookWithIntl(() => useChangeLocale(), { locale: 'es' });
      act(() => first.result.current.changeLocale('en'));
      first.unmount();

      // The navigation finished: the URL no longer has the hash and the header remounted in English
      window.history.replaceState(null, '', '/en/statistics/2024?x=1');
      navigationState.pathname = '/en/statistics/2024';
      renderHookWithIntl(() => useChangeLocale(), { locale: 'en' });

      expect(window.location.pathname + window.location.search).toBe('/en/statistics/2024?x=1');
      expect(window.location.hash).toBe('#sec');
      expect(pendingHash()).toBeNull();
    });

    it('ignores a stale entry left by a navigation that never finished', () => {
      const first = renderHookWithIntl(() => useChangeLocale(), { locale: 'es' });
      act(() => first.result.current.changeLocale('en'));
      first.unmount();

      window.history.replaceState(null, '', '/privacy-policy');
      renderHookWithIntl(() => useChangeLocale(), { locale: 'es' });

      expect(window.location.hash).toBe('');
      expect(pendingHash()).toBeNull();
    });
  });
});
