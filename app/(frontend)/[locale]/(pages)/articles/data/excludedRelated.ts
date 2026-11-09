import type { ArticleId } from './slugs';

/** Articles that must never appear in the "keep reading" list of a given article. */
export const excludedRelated: Partial<Record<ArticleId, ArticleId[]>> = {};
