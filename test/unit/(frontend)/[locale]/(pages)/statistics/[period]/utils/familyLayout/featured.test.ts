import { describe, expect, it } from 'vitest';
import { FEATURED_CATEGORIES } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/familyLayout/featured';
import { categoriesGroupedByFamilies, type CategoryFamilies } from '@/app/types/statistics';

const families = Object.keys(categoriesGroupedByFamilies) as CategoryFamilies[];

describe('FEATURED_CATEGORIES', () => {
  it.each(families)('lists exactly the categories of the %s family', (family) => {
    const expected = [...categoriesGroupedByFamilies[family]].sort();
    const actual = [...FEATURED_CATEGORIES[family].keys()].sort();

    expect({
      missing: expected.filter((category) => !actual.includes(category)),
      extra: actual.filter((category) => !expected.includes(category)),
    }).toEqual({ missing: [], extra: [] });
  });

  it.each(families)('gives the %s family priorities 1..n without repeats', (family) => {
    const priorities = [...FEATURED_CATEGORIES[family].values()].sort((a, b) => a - b);
    const expected = priorities.map((_, index) => index + 1);

    expect(priorities).toEqual(expected);
  });

  it('makes topNames the most important category of the names family', () => {
    expect(FEATURED_CATEGORIES.names.get('topNames')).toBe(1);
  });
});
