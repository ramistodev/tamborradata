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

/** Canonical + hreflang (including x-default) for a page, given its unprefixed pathname. */
export function getAlternates(locale: Locale, href: string) {
  return {
    canonical: localizedUrl(locale, href),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, href)])),
      'x-default': localizedUrl(routing.defaultLocale, href),
    },
  };
}

/** `og:locale` and `og:locale:alternate` values for a locale. */
export function getOpenGraphLocales(locale: Locale) {
  return {
    locale: openGraphLocales[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => openGraphLocales[l]),
  };
}
