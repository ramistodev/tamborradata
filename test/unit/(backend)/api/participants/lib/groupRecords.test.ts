import { describe, expect, it } from 'vitest';
import { groupRecords } from '@/app/(backend)/api/participants/lib/groupRecords';
import type { Candidate, Match } from '@/app/(backend)/api/participants/types';
import type { MatchType } from '@/app/types/api/participants.types';

const school = { canonicalName: 'S', schoolKey: 's' };

const match = (
  matchType: MatchType,
  overrides: Partial<Candidate> = {}
): Match => ({
  matchType,
  candidate: {
    name: 'Ane Garcia',
    nameKey: 'k1',
    year: 2024,
    url: null,
    school,
    names: ['ane'],
    surnames: ['garcia'],
    isIncomplete: false,
    ...overrides,
  },
});

describe('groupRecords', () => {
  it('merges the same name into one record with participations sorted by year descending', () => {
    const result = groupRecords([
      match('compatible', { year: 2022, url: 'u22' }),
      match('exact', { year: 2024, url: null }),
    ]);

    expect(result).toEqual([
      {
        matchType: 'exact',
        name: 'Ane Garcia',
        nameKey: 'k1',
        school,
        participations: [
          { url: null, year: 2024 },
          { url: 'u22', year: 2022 },
        ],
      },
    ]);
  });

  it('keeps exact when a compatible match comes after it', () => {
    const result = groupRecords([match('exact', { year: 2024 }), match('compatible', { year: 2022 })]);

    expect(result[0].matchType).toBe('exact');
  });

  it('keeps compatible when every match is compatible', () => {
    const result = groupRecords([
      match('compatible', { year: 2024 }),
      match('compatible', { year: 2022 }),
    ]);

    expect(result[0].matchType).toBe('compatible');
  });

  it('puts exact records first, then orders by latest participation descending', () => {
    const result = groupRecords([
      match('compatible', { nameKey: 'A', year: 2025 }),
      match('exact', { nameKey: 'B', year: 2020 }),
      match('compatible', { nameKey: 'C', year: 2024 }),
      match('exact', { nameKey: 'D', year: 2023 }),
    ]);

    expect(result.map((record) => record.nameKey)).toEqual(['D', 'B', 'A', 'C']);
  });

  it('returns an empty list for an empty input', () => {
    expect(groupRecords([])).toEqual([]);
  });

  it('never merges different name keys', () => {
    const result = groupRecords([
      match('compatible', { nameKey: 'k1' }),
      match('compatible', { nameKey: 'k2' }),
    ]);

    expect(result).toHaveLength(2);
    expect(result.map((record) => record.participations.length)).toEqual([1, 1]);
  });
});
