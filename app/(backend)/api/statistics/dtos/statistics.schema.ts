import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { isLocale } from '../../../lib/locale';
import { parsePeriodKey } from '../../../lib/period';

export function checkParams(periodKey: string | null, locale: string | null): string {
  const cleanPeriodKey = parsePeriodKey(periodKey, 'periodKey');

  if (!isLocale(locale)) {
    throw new ValidationError("The 'locale' parameter is required");
  }

  return cleanPeriodKey;
}
