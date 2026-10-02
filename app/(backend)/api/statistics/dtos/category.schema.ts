import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { parsePeriodKey } from '../../../lib/period';
import { clampLimit } from '../lib/pagination';
import { statisticCategories, StatisticCategories } from '../../../../types/statistics';

const VALID_CATEGORIES = new Set<string>(Object.values(statisticCategories));

export interface CategoryDetailParams {
  periodKey: string;
  category: StatisticCategories;
  limit: number;
  /** Token opaco del `nextCursor` de una página anterior; su contenido depende de la forma de datos. */
  cursor?: string;
}

export interface CategoryDetailQuery {
  period: string | null;
  category: string | null;
  limit: string | null;
  cursor: string | null;
}

export function checkCategoryDetailParams(query: CategoryDetailQuery): CategoryDetailParams {
  const periodKey = parsePeriodKey(query.period);

  if (!query.category || !VALID_CATEGORIES.has(query.category)) {
    throw new ValidationError("The 'category' parameter must be a known statistic category");
  }

  return {
    periodKey,
    category: query.category as StatisticCategories,
    limit: clampLimit(parseOptionalPositiveInt(query.limit, 'limit')),
    cursor: query.cursor ?? undefined,
  };
}

function parseOptionalPositiveInt(value: string | null, paramName: string): number | null {
  if (value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError(`The '${paramName}' parameter must be an integer >= 1`);
  }

  return parsed;
}
