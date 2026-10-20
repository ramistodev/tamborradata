import { describe, expect, it } from 'vitest';
import {
  categoriesGroupedByFamilies,
  categoryFamilies,
  editorialSectionCategories,
  editorialSections,
  statisticCategories,
} from '@/app/types/statistics';

describe('editorial section types', () => {
  it('configures categories for exactly the declared sections', () => {
    expect(Object.keys(editorialSectionCategories).sort()).toEqual(
      Object.values(editorialSections).sort()
    );
  });

  it('references only known categories', () => {
    const known = new Set<string>(Object.values(statisticCategories));
    const unknown = Object.entries(editorialSectionCategories).flatMap(([section, categories]) =>
      categories.filter((category) => !known.has(category)).map((category) => `${section}/${category}`)
    );

    expect(unknown).toEqual([]);
  });

  it('has no duplicates inside one section', () => {
    const duplicated = Object.entries(editorialSectionCategories)
      .filter(([, categories]) => new Set(categories).size !== categories.length)
      .map(([section]) => section);

    expect(duplicated).toEqual([]);
  });

  it('has only periodIntro and periodOutro as sections that are not families', () => {
    const families = new Set<string>(Object.values(categoryFamilies));
    const nonFamilies = Object.values(editorialSections).filter((section) => !families.has(section));

    expect(nonFamilies.sort()).toEqual(['periodIntro', 'periodOutro']);
  });

  it('has an editorial section for every family', () => {
    const sections = new Set<string>(Object.values(editorialSections));
    const missing = Object.values(categoryFamilies).filter((family) => !sections.has(family));

    expect(missing).toEqual([]);
  });

  it('keeps the editorial categories of a family section inside that family', () => {
    const offenders = Object.values(categoryFamilies).flatMap((family) => {
      const familyCategories: readonly string[] = categoriesGroupedByFamilies[family];

      return editorialSectionCategories[family]
        .filter((category) => !familyCategories.includes(category))
        .map((category) => `${family}/${category}`);
    });

    expect(offenders).toEqual([]);
  });
});
