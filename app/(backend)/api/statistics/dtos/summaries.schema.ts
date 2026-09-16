import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { isLocale } from '../../../lib/locale';
import { parsePeriodKey } from '../../../lib/period';

export interface SummariesParams {
  periodKey: string;
  locale: string;
}

export function checkSummariesParams(period: string | null, locale: string | null): SummariesParams {
  const periodKey = parsePeriodKey(period);

  if (!isLocale(locale)) {
    throw new ValidationError("The 'locale' parameter must be one of: es, eu, en");
  }

  return { periodKey, locale };
}
