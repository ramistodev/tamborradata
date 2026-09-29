import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { parsePeriodKey } from '../../../lib/period';
import { statisticCategories, StatisticCategories } from '../../../../types/statistics';

const VALID_CATEGORIES = new Set<string>(Object.values(statisticCategories));

/**
 * `afterRank` (ranks) and `afterEntityKey` (name/surname series) are mutually exclusive in
 * practice — a request only ever supplies the one matching the category's `data_shape`. That
 * shape isn't known yet at parse time (it's read from the DB later, in the service), so this
 * layer can't discriminate between them; grouping them under `cursor` at least keeps them
 * together as one related concept instead of two unrelated optional fields on the params bag.
 */
export interface CategoryDetailCursor {
  afterRank?: number;
  afterEntityKey?: string;
}

export interface CategoryDetailParams {
  periodKey: string;
  category: StatisticCategories;
  limit?: number;
  cursor: CategoryDetailCursor;
}

export interface CategoryDetailQuery {
  period: string | null;
  category: string | null;
  limit: string | null;
  afterRank: string | null;
  afterEntityKey: string | null;
}

export function checkCategoryDetailParams(query: CategoryDetailQuery): CategoryDetailParams {
  const periodKey = parsePeriodKey(query.period);

  if (!query.category || !VALID_CATEGORIES.has(query.category)) {
    throw new ValidationError("The 'category' parameter must be a known statistic category");
  }

  return {
    periodKey,
    category: query.category as StatisticCategories,
    limit: parseOptionalInt(query.limit, 'limit', { min: 1 }),
    cursor: {
      afterRank: parseOptionalInt(query.afterRank, 'afterRank', { min: 0 }),
      afterEntityKey: query.afterEntityKey ?? undefined,
    },
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
