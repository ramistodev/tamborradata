import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { isLocale } from '../../../lib/locale';
import { parsePeriodKey } from '../../../lib/period';
import { StatisticParams } from '../types';

export function checkParams(periodKey: string | null, locale: string | null): StatisticParams {
  const cleanPeriodKey = parsePeriodKey(periodKey, 'periodKey');

  if (!isLocale(locale)) {
    throw new ValidationError("The 'locale' parameter is required");
  }

  return { periodKey: cleanPeriodKey, locale };
}
