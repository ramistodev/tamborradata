import { describe, expect, it } from 'vitest';
import { adjacentPeriods } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/adjacentPeriods';
import { makeGlobalPeriod, makePeriod, makePeriodList } from '@/test/fixtures/period';

const year = (slug: string) => makePeriod({ periodKey: slug, publicSlug: slug });

describe('adjacentPeriods', () => {
  it('returns the newer and the older year for a middle year', () => {
    expect(adjacentPeriods(makePeriodList(), '2024')).toEqual({
      newer: year('2025'),
      older: year('2023'),
    });
  });

  it('has no newer period for the most recent year', () => {
    expect(adjacentPeriods(makePeriodList(), '2025')).toEqual({
      newer: null,
      older: year('2024'),
    });
  });

  it('has no older period for the oldest year', () => {
    expect(adjacentPeriods(makePeriodList(), '2023')).toEqual({
      newer: year('2024'),
      older: null,
    });
  });

  it.each(['global', '1999'])('returns no neighbours for the slug %s', (slug) => {
    expect(adjacentPeriods(makePeriodList(), slug)).toEqual({ newer: null, older: null });
  });

  it('gives the same result for shuffled input', () => {
    const [global, y2025, y2024, y2023] = makePeriodList();
    const expected = adjacentPeriods(makePeriodList(), '2024');

    expect(adjacentPeriods([y2023, y2025, global, y2024], '2024')).toEqual(expected);
  });

  it('returns no neighbours when there is a single year', () => {
    expect(adjacentPeriods([makeGlobalPeriod(), year('2024')], '2024')).toEqual({
      newer: null,
      older: null,
    });
  });

  it('links across a gap in the years', () => {
    const periods = [year('2025'), year('2023')];

    expect(adjacentPeriods(periods, '2025')).toEqual({ newer: null, older: year('2023') });
  });
});
