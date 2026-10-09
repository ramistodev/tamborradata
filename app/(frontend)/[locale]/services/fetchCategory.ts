import type {
  CategoryDetailRequest,
  CategoryDetailResponse,
} from '../../../types/api/statistics.types';

/** One page of a category from `GET /api/statistics/[period]/categories/[category]`. */
export async function fetchCategory({
  period,
  category,
  cursor,
  limit,
}: CategoryDetailRequest): Promise<CategoryDetailResponse> {
  const searchParams = new URLSearchParams();

  if (limit !== undefined) {
    searchParams.set('limit', String(limit));
  }

  if (cursor !== undefined) {
    searchParams.set('cursor', cursor);
  }

  const query = searchParams.size > 0 ? `?${searchParams}` : '';
  const response = await fetch(
    `/api/statistics/${encodeURIComponent(period)}/categories/${encodeURIComponent(category)}${query}`
  );
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error ?? 'Failed to fetch category data');
  }

  return body as CategoryDetailResponse;
}
