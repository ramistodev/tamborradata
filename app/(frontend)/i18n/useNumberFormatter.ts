import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '../../types/locale';

/**
 * Locale used to format numbers. Basque (`eu`) is formatted as Spanish: the grouping and decimal
 * separators are the same, and some browsers ship no `eu` data for `Intl`, so the client would
 * fall back to another locale and mismatch the server HTML (hydration error).
 */
const NUMBER_LOCALE = {
  es: 'es',
  eu: 'es',
  en: 'en',
} as const satisfies Record<Locale, string>;

/** Building an `Intl.NumberFormat` is slow, so each locale/options pair is built once. */
const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(locale: Locale, optionsKey: string): Intl.NumberFormat {
  const cacheKey = `${locale}|${optionsKey}`;
  const cached = formatters.get(cacheKey);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.NumberFormat(NUMBER_LOCALE[locale] ?? NUMBER_LOCALE.es, {
    // `always` so 4-digit numbers get their separator too (Spanish skips it by default: 1068).
    useGrouping: 'always',
    ...(JSON.parse(optionsKey) as Intl.NumberFormatOptions),
  });
  formatters.set(cacheKey, formatter);

  return formatter;
}

/**
 * Number formatter that gives the same text on the server and on the client. `options` are merged
 * over the defaults (e.g. `{ notation: 'compact' }` or `{ style: 'percent', signDisplay: 'always' }`).
 */
export function useNumberFormatter(options: Intl.NumberFormatOptions = {}) {
  const locale = useLocale() as Locale;
  const optionsKey = JSON.stringify(options);

  return useMemo(() => formatterFor(locale, optionsKey), [locale, optionsKey]);
}
