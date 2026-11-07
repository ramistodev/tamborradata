import { siteUrl } from '@/app/(frontend)/[locale]/config/constants';
import type { Locale } from '../../types/locale';
import { getPathname } from './navigation';
import { routing } from './routing';

const openGraphLocales: Record<Locale, string> = {
  es: 'es_ES',
  eu: 'eu_ES',
  en: 'en_US',
};

function localizedUrl(locale: Locale, href: string) {
  const pathname = getPathname({ locale, href });
  return pathname === '/' ? siteUrl : `${siteUrl}${pathname}`;
}

/** Canonical + hreflang (including x-default) for a page, given its unprefixed pathname (one for all locales, or one per locale). */
export function getAlternates(locale: Locale, href: string | Record<Locale, string>) {
  const hrefOf = (l: Locale) => (typeof href === 'string' ? href : href[l]);

  return {
    canonical: localizedUrl(locale, hrefOf(locale)),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, hrefOf(l))])),
      'x-default': localizedUrl(routing.defaultLocale, hrefOf(routing.defaultLocale)),
    },
  };
}

/** BCP 47 language tag of a locale (es-ES, eu-ES, en-US), e.g. for JSON-LD `inLanguage`. */
export function getLanguageTag(locale: Locale) {
  return openGraphLocales[locale].replace('_', '-');
}

/** `og:locale` and `og:locale:alternate` values for a locale. */
export function getOpenGraphLocales(locale: Locale) {
  return {
    locale: openGraphLocales[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => openGraphLocales[l]),
  };
}
