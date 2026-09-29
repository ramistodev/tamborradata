import 'server-only';
import type { Pagination } from '../types';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export function clampLimit(limit: number | undefined, defaultLimit: number = DEFAULT_PAGE_SIZE): number {
  return Math.min(limit ?? defaultLimit, MAX_PAGE_SIZE);
}

export function normalizeOffsetPagination(pagination: Pagination = {}): Required<Pagination> {
  const { limit = 10, offset = 0 } = pagination;

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Pagination limit must be a positive integer.');
  }

  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error('Pagination offset must be a non-negative integer.');
  }

  return { limit: clampLimit(limit, 10), offset };
}

/** Shared shape for every cursor-paginated repo query, regardless of what the cursor is keyed on. */
export interface CursorPage<T> {
  items: T[];
  hasNextPage: boolean;
}

/**
 * Normalizes `{ limit, after }` for any cursor-based query: clamps `limit` and falls back to
 * `defaultAfter` when no cursor was given. `After` is whatever the caller's cursor field holds
 * (a `rank` number for rankings, an `entity_key` string for series) — the field's own name stays
 * with the caller, only the clamp-and-default mechanics are shared here.
 */
export function normalizeCursorPagination<After>(
  pagination: { limit?: number; after?: After },
  defaultAfter: After
): { limit: number; after: After } {
  const { limit, after = defaultAfter } = pagination;
  return { limit: clampLimit(limit), after };
}
