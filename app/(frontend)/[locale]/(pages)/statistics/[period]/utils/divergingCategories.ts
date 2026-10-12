import { StatisticCategories, statisticCategories } from '../../../../../../types/statistics';

/**
 * Rankings whose values carry a sign and are shown as a diverging bar: growth to the right of the
 * centre axis (green), decline to the left (red). Only the ranking shape of a category matters
 * here; in a series period the same category is a line chart that already handles its own sign.
 */
export const DIVERGING_CATEGORIES: ReadonlySet<StatisticCategories> = new Set([
  statisticCategories.schoolGrowthRate,
]);
