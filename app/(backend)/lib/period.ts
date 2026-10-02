import { ValidationError } from './errors';
import { periodKind } from '../../types/period.types';

const YEAR_PERIOD_KEY_REGEX = /^year:\d{4}$/;

export function parsePeriodKey(periodKey: string | null, paramName = 'period'): string {
  if (!periodKey) {
    throw new ValidationError(`The '${paramName}' parameter is required`);
  }

  const cleanPeriodKey = periodKey.trim();
  const isGlobal = cleanPeriodKey === periodKind.global;
  const isYear = YEAR_PERIOD_KEY_REGEX.test(cleanPeriodKey);

  if (!isGlobal && !isYear) {
    throw new ValidationError(
      `The '${paramName}' parameter must be 'global' or have the format 'year:YYYY'`
    );
  }

  return cleanPeriodKey;
}
