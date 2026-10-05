import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { isLocale } from '../../../lib/locale';
import { parsePublicSlug } from '../../../lib/period';
import { StatisticParams } from '../types';

export function checkParams(publicSlug: string | null, locale: string | null): StatisticParams {
  const cleanPublicSlug = parsePublicSlug(publicSlug);

  if (!isLocale(locale)) {
    throw new ValidationError("The 'locale' parameter is required");
  }

  return { publicSlug: cleanPublicSlug, locale };
}
