import { describe, expect, it } from 'vitest';
import { withMissingYears } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/withMissingYears';
import { makeGlobalPeriod, makePeriod } from '@/test/fixtures/period';

const year = (value: number) => makePeriod({ periodKey: String(value), publicSlug: String(value) });
const period = (value: number) => ({ type: 'period', period: year(value) });
const missing = (value: number) => ({ type: 'missing', year: value });

describe('withMissingYears', () => {
  it('inserts a missing item in a descending list', () => {
    expect(withMissingYears([year(2024), year(2022), year(2021)])).toEqual([
      period(2024),
      missing(2023),
      period(2022),
      period(2021),
    ]);
  });

  it('inserts a missing item in an ascending list', () => {
    expect(withMissingYears([year(2021), year(2023)])).toEqual([
      period(2021),
      missing(2022),
      period(2023),
    ]);
  });

  it('adds nothing for consecutive years', () => {
    expect(withMissingYears([year(2024), year(2023), year(2022)])).toEqual([
      period(2024),
      period(2023),
      period(2022),
    ]);
  });

  it('leaves a leading global period untouched', () => {
    expect(withMissingYears([makeGlobalPeriod(), year(2024), year(2022)])).toEqual([
      { type: 'period', period: makeGlobalPeriod() },
      period(2024),
      missing(2023),
      period(2022),
    ]);
  });

  it('does not change a trailing global period', () => {
    expect(withMissingYears([year(2024), makeGlobalPeriod()])).toEqual([
      period(2024),
      { type: 'period', period: makeGlobalPeriod() },
    ]);
  });

  it('inserts every missing year in order', () => {
    expect(withMissingYears([year(2025), year(2021)])).toEqual([
      period(2025),
      missing(2024),
      missing(2023),
      missing(2022),
      period(2021),
    ]);
  });

  it('returns an empty array for an empty input', () => {
    expect(withMissingYears([])).toEqual([]);
  });

  it('treats a non-year slug like the global period', () => {
    const old = makePeriod({ periodKey: '2024-old', publicSlug: '2024-old' });

    expect(withMissingYears([year(2025), old, year(2023)])).toEqual([
      period(2025),
      { type: 'period', period: old },
      missing(2024),
      period(2023),
    ]);
  });
});
