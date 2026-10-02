import 'server-only';
import { ValidationError } from '../../../lib/errors';
import { SchoolsParams } from '../types';

const MAX_QUERY_LENGTH = 100;

export function checkSchoolsParams(query: string | null): SchoolsParams {
  if (query === null) {
    return {};
  }

  const cleanQuery = query.trim();

  if (cleanQuery === '') {
    return {};
  }

  if (cleanQuery.length > MAX_QUERY_LENGTH) {
    throw new ValidationError(
      `The 'query' parameter must be at most ${MAX_QUERY_LENGTH} characters`
    );
  }

  return { query: cleanQuery };
}
