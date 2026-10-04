import { defineRouting } from 'next-intl/routing';
import { locale } from '../../types/locale';

export const routing = defineRouting({
  locales: Object.values(locale),
  defaultLocale: locale.es,
  localePrefix: 'as-needed',
  localeDetection: false,
  alternateLinks: false,
});
