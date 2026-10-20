import { describe, expect, it } from 'vitest';
import { sortPeriods } from '@/app/(frontend)/[locale]/lib/sortPeriods';
import { makeGlobalPeriod, makePeriod } from '@/test/fixtures/period';

const slugs = (periods: { publicSlug: string }[]) => periods.map((period) => period.publicSlug);

describe('sortPeriods', () => {
  it('moves the global period to the front', () => {
    const periods = [
      makePeriod({ periodKey: '2024', publicSlug: '2024' }),
      makeGlobalPeriod(),
      makePeriod({ periodKey: '2023', publicSlug: '2023' }),
    ];

    expect(slugs(sortPeriods(periods))).toEqual(['global', '2024', '2023']);
  });

  it('keeps the order when the global period is already first', () => {
    const periods = [
      makeGlobalPeriod(),
      makePeriod({ periodKey: '2024', publicSlug: '2024' }),
      makePeriod({ periodKey: '2023', publicSlug: '2023' }),
    ];

    expect(slugs(sortPeriods(periods))).toEqual(['global', '2024', '2023']);
  });

  it('keeps the order when there is no global period', () => {
    const periods = [
      makePeriod({ periodKey: '2023', publicSlug: '2023' }),
      makePeriod({ periodKey: '2025', publicSlug: '2025' }),
      makePeriod({ periodKey: '2024', publicSlug: '2024' }),
    ];

    expect(slugs(sortPeriods(periods))).toEqual(['2023', '2025', '2024']);
  });

  it('keeps the relative order of the non-global periods', () => {
    const periods = [
      makePeriod({ periodKey: '2022', publicSlug: '2022' }),
      makePeriod({ periodKey: '2024', publicSlug: '2024' }),
      makeGlobalPeriod(),
    ];

    expect(slugs(sortPeriods(periods))).toEqual(['global', '2022', '2024']);
  });

  it('returns an empty list for an empty input', () => {
    expect(sortPeriods([])).toEqual([]);
  });

  it('does not mutate the input and returns a different array', () => {
    const periods = [makePeriod(), makeGlobalPeriod()];
    const before = [...periods];

    const result = sortPeriods(periods);

    expect(result).not.toBe(periods);
    expect(periods).toEqual(before);
    expect(periods[0]).toBe(before[0]);
  });
});
