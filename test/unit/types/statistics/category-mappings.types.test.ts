import { describe, expect, it } from 'vitest';
import {
  categoryDataShape,
  categoryRendererKey,
  statisticCategories,
  statisticCategoryPeriodConfig,
  statisticRendererDataShape,
} from '@/app/types/statistics';
import { periodKind } from '@/app/types/period.types';

const config: Record<string, Partial<Record<string, { dataShape: string; rendererKey: string }>>> =
  statisticCategoryPeriodConfig;

describe('statisticCategoryPeriodConfig', () => {
  it('has an entry for every category', () => {
    const missing = Object.values(statisticCategories).filter((category) => !(category in config));

    expect(missing).toEqual([]);
  });

  it('has no entry outside the known categories', () => {
    const known = new Set<string>(Object.values(statisticCategories));
    const unknown = Object.keys(config).filter((key) => !known.has(key));

    expect(unknown).toEqual([]);
  });

  it('defines at least one period kind per entry and only known kinds', () => {
    const allowed = new Set<string>(Object.values(periodKind));
    const offenders = Object.entries(config)
      .filter(([, kinds]) => {
        const keys = Object.keys(kinds);
        return keys.length === 0 || keys.some((key) => !allowed.has(key));
      })
      .map(([category]) => category);

    expect(offenders).toEqual([]);
  });

  describe('presentations', () => {
    const presentations = Object.entries(config).flatMap(([category, kinds]) =>
      Object.entries(kinds).map(([kind, presentation]) => ({
        label: `${category}/${kind}`,
        ...presentation!,
      }))
    );

    it('pairs every renderer key with its own data shape', () => {
      const offenders = presentations
        .filter(
          ({ dataShape, rendererKey }) =>
            dataShape !==
            (statisticRendererDataShape as Record<string, string>)[rendererKey]
        )
        .map(({ label }) => label);

      expect(offenders).toEqual([]);
    });

    it('uses only known renderer keys', () => {
      const known = new Set<string>(Object.values(categoryRendererKey));
      const offenders = presentations.filter(({ rendererKey }) => !known.has(rendererKey));

      expect(offenders.map(({ label }) => label)).toEqual([]);
    });

    it('uses only known data shapes', () => {
      const known = new Set<string>(Object.values(categoryDataShape));
      const offenders = presentations.filter(({ dataShape }) => !known.has(dataShape));

      expect(offenders.map(({ label }) => label)).toEqual([]);
    });
  });

  it.each(['commonNameBySchool', 'commonSurnameBySchool'] as const)(
    'renders %s as a data table for both period kinds',
    (category) => {
      expect(statisticCategoryPeriodConfig[category].year.rendererKey).toBe('dataTable');
      expect(statisticCategoryPeriodConfig[category].global.rendererKey).toBe('dataTable');
    }
  );
});
