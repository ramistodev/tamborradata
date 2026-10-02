import { locale as locales, type Locale } from '../../types/locale';

export function isLocale(value: string | null): value is Locale {
  return value !== null && Object.values(locales).includes(value as Locale);
}
