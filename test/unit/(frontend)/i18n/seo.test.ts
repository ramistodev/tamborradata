import { describe, expect, it } from 'vitest';
import { getAlternates, getLanguageTag, getOpenGraphLocales } from '@/app/(frontend)/i18n/seo';

const LOCALES_IN_ROUTING_ORDER = ['en', 'es', 'eu'] as const;

describe('seo', () => {
  describe('getAlternates', () => {
    it('returns the root URLs without a trailing slash', () => {
      expect(getAlternates('es', '/')).toEqual({
        canonical: 'https://tamborradata.com',
        languages: {
          en: 'https://tamborradata.com/en',
          es: 'https://tamborradata.com',
          eu: 'https://tamborradata.com/eu',
          'x-default': 'https://tamborradata.com',
        },
      });
    });

    it('returns the English root canonical without a trailing slash', () => {
      expect(getAlternates('en', '/').canonical).toBe('https://tamborradata.com/en');
    });

    it('prefixes the canonical of a non-default locale', () => {
      const alternates = getAlternates('en', '/search-participants');
      const languages: Record<string, string> = alternates.languages;

      expect(alternates.canonical).toBe('https://tamborradata.com/en/search-participants');
      expect(languages.es).toBe('https://tamborradata.com/search-participants');
      expect(languages.eu).toBe('https://tamborradata.com/eu/search-participants');
      expect(languages['x-default']).toBe(languages.es);
    });

    it('uses the Basque prefix in the canonical of a nested path', () => {
      expect(getAlternates('eu', '/statistics/2024').canonical).toBe(
        'https://tamborradata.com/eu/statistics/2024'
      );
    });

    it.each(LOCALES_IN_ROUTING_ORDER)('lists every language and x-default for %s', (locale) => {
      const { languages } = getAlternates(locale, '/statistics/2024');

      expect(Object.keys(languages).sort()).toEqual(['en', 'es', 'eu', 'x-default']);
    });
  });

  describe('getLanguageTag', () => {
    it.each([
      { locale: 'es', tag: 'es-ES' },
      { locale: 'eu', tag: 'eu-ES' },
      { locale: 'en', tag: 'en-US' },
    ] as const)('maps $locale to $tag', ({ locale, tag }) => {
      expect(getLanguageTag(locale)).toBe(tag);
    });
  });

  describe('getOpenGraphLocales', () => {
    it.each([
      { locale: 'es', expected: { locale: 'es_ES', alternateLocale: ['en_US', 'eu_ES'] } },
      { locale: 'en', expected: { locale: 'en_US', alternateLocale: ['es_ES', 'eu_ES'] } },
      { locale: 'eu', expected: { locale: 'eu_ES', alternateLocale: ['en_US', 'es_ES'] } },
    ] as const)('maps $locale to its Open Graph locales', ({ locale, expected }) => {
      expect(getOpenGraphLocales(locale)).toEqual(expected);
    });
  });
});
