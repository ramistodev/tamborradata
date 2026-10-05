import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { isLocale } from '../../../lib/locale';
import { parsePublicSlug } from '../../../lib/period';
import { Locale } from '../../../../types/locale';

export interface SummariesParams {
  publicSlug: string;
  locale: Locale;
}

export function checkSummariesParams(
  period: string | null,
  locale: string | null
): SummariesParams {
  const publicSlug = parsePublicSlug(period, 'period');

  if (!isLocale(locale)) {
    throw new ValidationError("The 'locale' parameter must be one of: es, eu, en");
  }

  return { publicSlug, locale };
}
