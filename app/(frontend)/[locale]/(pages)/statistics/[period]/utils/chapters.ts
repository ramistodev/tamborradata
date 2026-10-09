import type { StatisticFamily } from '@/app/types/api/statistics.types';
import { CategoryFamilies, categoryFamilies } from '@/app/types/statistics';

/** Id of the hero section: the first "chapter" of the nav, always present. */
export const OVERVIEW_CHAPTER_ID = 'overview';

// Position of each family in the page. Every family must have one (enforced by the compiler), and
// the chapter's section must use the family name as its `id`.
export const CHAPTER_ORDER = {
  [categoryFamilies.participationDynamics]: 1,
  [categoryFamilies.names]: 2,
  [categoryFamilies.surnames]: 3,
  [categoryFamilies.identityDiversity]: 4,
  [categoryFamilies.schools]: 5,
  [categoryFamilies.schoolsRenewal]: 6,
  [categoryFamilies.schoolsEvolution]: 7,
} as const satisfies Record<CategoryFamilies, number>;

/** Returns a new array of families in page order; never mutates the (cached) response. */
export function sortFamilies(families: StatisticFamily[]): StatisticFamily[] {
  return [...families].sort((a, b) => CHAPTER_ORDER[a.family] - CHAPTER_ORDER[b.family]);
}
