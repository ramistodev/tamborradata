import { describe, expect, it } from 'vitest';
import { DIVERGING_CATEGORIES } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/divergingCategories';
import { statisticCategories } from '@/app/types/statistics';

describe('DIVERGING_CATEGORIES', () => {
  it('contains only the school growth rate', () => {
    expect(DIVERGING_CATEGORIES).toEqual(new Set(['schoolGrowthRate']));
  });

  it('only contains known statistic categories', () => {
    const known: readonly string[] = Object.values(statisticCategories);
    const unknown = [...DIVERGING_CATEGORIES].filter((category) => !known.includes(category));

    expect(unknown).toEqual([]);
  });
});
