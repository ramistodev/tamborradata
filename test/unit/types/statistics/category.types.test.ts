import { describe, expect, it } from 'vitest';
import {
  categoriesGroupedByFamilies,
  categoryFamilies,
  schoolGroupedRankCategories,
  statisticCategories,
} from '@/app/types/statistics';

describe('category types', () => {
  it('has a family list for exactly the declared families', () => {
    expect(Object.keys(categoriesGroupedByFamilies).sort()).toEqual(
      Object.values(categoryFamilies).sort()
    );
  });

  it('lists every category in exactly one family', () => {
    const counts = new Map<string, number>();
    for (const categories of Object.values(categoriesGroupedByFamilies)) {
      for (const category of categories) counts.set(category, (counts.get(category) ?? 0) + 1);
    }

    const missing = Object.values(statisticCategories).filter((category) => !counts.has(category));
    const duplicated = [...counts].filter(([, count]) => count > 1).map(([category]) => category);

    expect(missing).toEqual([]);
    expect(duplicated).toEqual([]);
  });

  it('lists only known categories in the families', () => {
    const known = new Set<string>(Object.values(statisticCategories));
    const unknown = Object.values(categoriesGroupedByFamilies)
      .flat()
      .filter((category) => !known.has(category));

    expect(unknown).toEqual([]);
  });

  it('keeps each category key equal to its value', () => {
    const offenders = Object.entries(statisticCategories).filter(([key, value]) => key !== value);

    expect(offenders).toEqual([]);
  });

  describe('schoolGroupedRankCategories', () => {
    it('contains exactly the two by-school categories', () => {
      expect(schoolGroupedRankCategories).toEqual(
        new Set(['commonNameBySchool', 'commonSurnameBySchool'])
      );
    });

    it('keeps them in the schools family', () => {
      const schools: readonly string[] = categoriesGroupedByFamilies.schools;
      const outside = [...schoolGroupedRankCategories].filter((category) => !schools.includes(category));

      expect(outside).toEqual([]);
    });
  });
});
