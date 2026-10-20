import { describe, expect, it } from 'vitest';
import { assertStatisticPresentation } from '@/app/(backend)/api/statistics/lib/assertStatisticPresentation';
import {
  statisticCategoryPeriodConfig,
  type StatisticCategories,
} from '@/app/types/statistics';
import type { PeriodKind } from '@/app/types/period.types';
import { makeStatisticsHeader } from '@/test/fixtures/dbRows';

describe('assertStatisticPresentation', () => {
  it('accepts a matching ranks header for a year', () => {
    const header = makeStatisticsHeader({
      category: 'topNames',
      data_shape: 'ranks',
      renderer_key: 'horizontalRanking',
    });

    expect(assertStatisticPresentation(header, 'year')).toBeUndefined();
  });

  it('accepts a matching data table header for a global period', () => {
    const header = makeStatisticsHeader({
      category: 'commonNameBySchool',
      data_shape: 'ranks',
      renderer_key: 'dataTable',
    });

    expect(() => assertStatisticPresentation(header, 'global')).not.toThrow();
  });

  it('accepts the configured presentation of every category and period kind', () => {
    const failures: string[] = [];

    for (const [category, kinds] of Object.entries(statisticCategoryPeriodConfig)) {
      for (const [kind, presentation] of Object.entries(kinds)) {
        const header = makeStatisticsHeader({
          category: category as StatisticCategories,
          data_shape: presentation.dataShape,
          renderer_key: presentation.rendererKey,
        });

        try {
          assertStatisticPresentation(header, kind as PeriodKind);
        } catch {
          failures.push(`${category}/${kind}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('throws when the data shape differs', () => {
    const header = makeStatisticsHeader({ data_shape: 'values' });

    expect(() => assertStatisticPresentation(header, 'year')).toThrow(
      new Error(
        'Integrity error: published statistic "topNames" for period kind "year" has data_shape "values"/renderer_key "horizontalRanking" in the database, but the category configuration expects "ranks"/"horizontalRanking".'
      )
    );
  });

  it('throws when the renderer key differs', () => {
    const header = makeStatisticsHeader({ renderer_key: 'dataTable' });

    expect(() => assertStatisticPresentation(header, 'year')).toThrow(
      new Error(
        'Integrity error: published statistic "topNames" for period kind "year" has data_shape "ranks"/renderer_key "dataTable" in the database, but the category configuration expects "ranks"/"horizontalRanking".'
      )
    );
  });

  it('throws when the category does not exist for the period kind', () => {
    const header = makeStatisticsHeader({ category: 'newNames' });

    expect(() => assertStatisticPresentation(header, 'global')).toThrow(
      new Error('Statistic category "newNames" does not support period kind "global".')
    );
  });
});
