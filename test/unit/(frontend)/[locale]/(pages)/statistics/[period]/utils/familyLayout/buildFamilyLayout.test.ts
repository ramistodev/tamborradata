import { describe, expect, it } from 'vitest';
import { buildFamilyLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/familyLayout/buildFamilyLayout';
import {
  makeFamily,
  makeRanksCategory,
  makeSeriesCategory,
  makeValuesCategory,
} from '@/test/fixtures/statistics';

const names = (categories: { category: string }[]) => categories.map((c) => c.category);

describe('buildFamilyLayout', () => {
  it('splits the names family by shape and sorts by priority', () => {
    const family = makeFamily('names', [
      makeRanksCategory('newNames'),
      makeRanksCategory('topNames'),
      makeSeriesCategory('nameTrends'),
      makeRanksCategory('topSecondNames', []),
      makeValuesCategory('participantsWithMultipleNames'),
    ]);

    const layout = buildFamilyLayout(family);

    expect(names(layout.ranks)).toEqual(['topNames', 'newNames']);
    expect(names(layout.series)).toEqual(['nameTrends']);
    expect(names(layout.values)).toEqual(['participantsWithMultipleNames']);
    expect(layout.tables).toEqual([]);
  });

  it('puts data tables in their own block', () => {
    const family = makeFamily('schools', [
      makeRanksCategory('commonNameBySchool'),
      makeRanksCategory('topSchools'),
      makeValuesCategory('averageSchoolSize'),
    ]);

    const layout = buildFamilyLayout(family);

    expect(names(layout.tables)).toEqual(['commonNameBySchool']);
    expect(layout.tables[0].rendererKey).toBe('dataTable');
    expect(names(layout.ranks)).toEqual(['topSchools']);
    expect(names(layout.values)).toEqual(['averageSchoolSize']);
  });

  it('places every non-empty category exactly once', () => {
    const family = makeFamily('names', [
      makeRanksCategory('newNames'),
      makeRanksCategory('topNames'),
      makeSeriesCategory('nameTrends'),
      makeRanksCategory('topSecondNames', []),
      makeValuesCategory('participantsWithMultipleNames'),
    ]);

    const layout = buildFamilyLayout(family);
    const placed = [...layout.series, ...layout.ranks, ...layout.values, ...layout.tables];

    expect(names(placed).sort()).toEqual(['newNames', 'nameTrends', 'participantsWithMultipleNames', 'topNames'].sort());
  });

  it('sorts a category outside the family priorities after the prioritized ones', () => {
    const family = makeFamily('names', [
      makeRanksCategory('topSchools'),
      makeRanksCategory('newNames'),
    ]);

    expect(names(buildFamilyLayout(family).ranks)).toEqual(['newNames', 'topSchools']);
  });

  it('does not mutate the categories of the family', () => {
    const family = makeFamily('names', [
      makeRanksCategory('newNames'),
      makeRanksCategory('topNames'),
    ]);

    buildFamilyLayout(family);

    expect(names(family.categories)).toEqual(['newNames', 'topNames']);
  });

  it('returns four empty blocks for a family without data', () => {
    const family = makeFamily('names', [makeRanksCategory('topNames', [])]);

    expect(buildFamilyLayout(family)).toEqual({ series: [], ranks: [], values: [], tables: [] });
  });
});
