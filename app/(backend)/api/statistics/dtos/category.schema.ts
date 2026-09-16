import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { parsePeriodKey } from '../../../lib/period';
import { statisticCategories, StatisticCategories } from '../../../../types/statistics';

const VALID_CATEGORIES = new Set<string>(Object.values(statisticCategories));

export interface CategoryDetailParams {
  periodKey: string;
  category: StatisticCategories;
  limit?: number;
  afterRank?: number;
}

export function checkCategoryDetailParams(
  period: string | null,
  category: string | null,
  limitParam: string | null,
  afterRankParam: string | null
): CategoryDetailParams {
  const periodKey = parsePeriodKey(period);

  if (!category || !VALID_CATEGORIES.has(category)) {
    throw new ValidationError("The 'category' parameter must be a known statistic category");
  }

  return {
    periodKey,
    category: category as StatisticCategories,
    limit: parseOptionalInt(limitParam, 'limit', { min: 1 }),
    afterRank: parseOptionalInt(afterRankParam, 'afterRank', { min: 0 }),
  };
}

function parseOptionalInt(
  value: string | null,
  paramName: string,
  { min }: { min: number }
): number | undefined {
  if (value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min) {
    throw new ValidationError(`The '${paramName}' parameter must be an integer >= ${min}`);
  }

  return parsed;
}
