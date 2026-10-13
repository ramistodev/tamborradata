import type {
  CategoryDetailRequest,
  CategoryDetailResponse,
} from '../../../types/api/statistics.types';

export const CATEGORY_REQUEST_TIMEOUT_MS = 10_000;

/**
 * One page of a category from `GET /api/statistics/[period]/categories/[category]`. Aborts after
 * `CATEGORY_REQUEST_TIMEOUT_MS` so a stalled request surfaces as an error instead of loading forever.
 */
export async function fetchCategory({
  period,
  category,
  cursor,
  limit,
  signal,
}: CategoryDetailRequest & { signal?: AbortSignal }): Promise<CategoryDetailResponse> {
  const searchParams = new URLSearchParams();

  if (limit !== undefined) {
    searchParams.set('limit', String(limit));
  }

  if (cursor !== undefined) {
    searchParams.set('cursor', cursor);
  }

  const query = searchParams.size > 0 ? `?${searchParams}` : '';
  const response = await fetch(
    `/api/statistics/${encodeURIComponent(period)}/categories/${encodeURIComponent(category)}${query}`,
    {
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(CATEGORY_REQUEST_TIMEOUT_MS)])
        : AbortSignal.timeout(CATEGORY_REQUEST_TIMEOUT_MS),
    }
  );
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error ?? 'Failed to fetch category data');
  }

  return body as CategoryDetailResponse;
}
