import { describe, expect, it } from 'vitest';
import {
  categoriesGroupedByFamilies,
  categoryFamily,
  editorialSectionCategories,
  editorialSections,
  getAllowedCategories,
  getStatisticCategoryPresentation,
  statisticCategories,
  statisticCategoryPeriodConfig,
  type CategoryFamilies,
  type StatisticCategories,
} from '@/app/types/statistics';
import { periodKind } from '@/app/types/period.types';

describe('categoryFamily', () => {
  it.each([
    ['topNames', 'names'],
    ['topSurnames', 'surnames'],
    ['topSchools', 'schools'],
    ['totalParticipants', 'participationDynamics'],
  ] as const)('resolves %s to %s', (category, family) => {
    expect(categoryFamily(category)).toBe(family);
  });

  it('assigns every category to exactly one family', () => {
    const families = Object.entries(categoriesGroupedByFamilies) as [
      CategoryFamilies,
      readonly StatisticCategories[],
    ][];

    const offenders = Object.values(statisticCategories).filter(
      (category) => families.filter(([, categories]) => categories.includes(category)).length !== 1
    );

    expect(offenders).toEqual([]);
  });

  it('throws for an unknown category', () => {
    expect(() => categoryFamily('nope' as never)).toThrow(
      new Error('No category family configured for statistic category: nope')
    );
  });
});

describe('getStatisticCategoryPresentation', () => {
  it.each([
    ['topNames', 'year', { dataShape: 'ranks', rendererKey: 'horizontalRanking' }],
    ['participantsGrowthRate', 'global', { dataShape: 'series', rendererKey: 'lineChart' }],
    ['participantsGrowthRate', 'year', { dataShape: 'values', rendererKey: 'metricCard' }],
  ] as const)('resolves %s for %s', (category, kind, expected) => {
    expect(getStatisticCategoryPresentation(category, kind)).toEqual(expected);
  });

  it('throws when the category does not support the period kind', () => {
    expect(() => getStatisticCategoryPresentation('newNames', 'global')).toThrow(
      new Error('Statistic category "newNames" does not support period kind "global".')
    );
  });
});

describe('getAllowedCategories', () => {
  it('returns nothing for a section whose categories are all global-only on a year', () => {
    expect(getAllowedCategories('schoolsEvolution', 'year')).toEqual([]);
  });

  it('returns every category of schoolsEvolution on a global period', () => {
    expect(getAllowedCategories('schoolsEvolution', 'global')).toEqual([
      'schoolsEvolution',
      'schoolLongevity',
      'mostConstantSchools',
    ]);
  });

  it('filters periodIntro for a year', () => {
    expect(getAllowedCategories('periodIntro', 'year')).toEqual([
      'totalParticipants',
      'participantsGrowthRate',
      'newNames',
      'nameComebacks',
      'newSchools',
    ]);
  });

  it('filters periodIntro for a global period', () => {
    expect(getAllowedCategories('periodIntro', 'global')).toEqual([
      'totalParticipants',
      'participantsGrowthRate',
      'participationRecordYears',
      'nameComebacks',
    ]);
  });

  it('never returns a category absent for the kind, for any section', () => {
    const offenders: string[] = [];

    for (const section of Object.values(editorialSections)) {
      for (const kind of Object.values(periodKind)) {
        for (const category of getAllowedCategories(section, kind)) {
          if (!(kind in statisticCategoryPeriodConfig[category])) {
            offenders.push(`${section}/${kind}/${category}`);
          }
          if (!editorialSectionCategories[section].some((item) => item === category)) {
            offenders.push(`${section}/${kind}/${category} (not in section)`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
