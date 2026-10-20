import { describe, expect, it } from 'vitest';
import { dropCoveredIncompletes } from '@/app/(backend)/api/participants/lib/dropCoveredIncompletes';
import type { Candidate, Match } from '@/app/(backend)/api/participants/types';
import type { MatchType } from '@/app/types/api/participants.types';

const m = (overrides: Partial<Candidate>, matchType: MatchType = 'compatible'): Match => ({
  matchType,
  candidate: {
    name: 'Ana Maria Garcia Lopez',
    nameKey: 'ana maria garcia lopez',
    year: 2024,
    url: null,
    school: { canonicalName: 'S', schoolKey: 's' },
    names: ['ana', 'maria'],
    surnames: ['garcia', 'lopez'],
    isIncomplete: false,
    ...overrides,
  },
});

const completeOverrides = {
  year: 2024,
  names: ['ana', 'maria'],
  surnames: ['garcia', 'lopez'],
  isIncomplete: false,
};
const incompleteOverrides = {
  year: 2024,
  names: ['ana'],
  surnames: ['garcia'],
  isIncomplete: true,
  nameKey: 'ana garcia',
};

describe('dropCoveredIncompletes', () => {
  it('drops the incomplete placed before its complete match', () => {
    const a = m(completeOverrides);
    const b = m(incompleteOverrides);

    const result = dropCoveredIncompletes([b, a]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(a);
  });

  it('drops the incomplete placed after its complete match', () => {
    const a = m(completeOverrides);
    const b = m(incompleteOverrides);

    const result = dropCoveredIncompletes([a, b]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(a);
  });

  it('keeps an incomplete of another year', () => {
    const a = m(completeOverrides);
    const b = m({ ...incompleteOverrides, year: 2023 });

    expect(dropCoveredIncompletes([a, b])).toEqual([a, b]);
  });

  it('keeps an incomplete with another first surname', () => {
    const a = m(completeOverrides);
    const b = m({ ...incompleteOverrides, surnames: ['perez'] });

    expect(dropCoveredIncompletes([a, b])).toEqual([a, b]);
  });

  it('keeps an incomplete whose names are not a subsequence', () => {
    const a = m(completeOverrides);
    const b = m({ ...incompleteOverrides, names: ['luis'] });

    expect(dropCoveredIncompletes([a, b])).toEqual([a, b]);
  });

  it('drops an incomplete whose names are a subsequence', () => {
    const a = m(completeOverrides);
    const b = m({ ...incompleteOverrides, names: ['maria'] });

    expect(dropCoveredIncompletes([a, b])).toEqual([a]);
  });

  it('keeps a lone incomplete', () => {
    const b = m(incompleteOverrides);

    expect(dropCoveredIncompletes([b])).toEqual([b]);
  });

  it('keeps several incompletes when there is no complete', () => {
    const b1 = m(incompleteOverrides);
    const b2 = m({ ...incompleteOverrides, names: ['luis'], nameKey: 'luis garcia' });

    expect(dropCoveredIncompletes([b1, b2])).toEqual([b1, b2]);
  });

  it('keeps several completes in order', () => {
    const a1 = m(completeOverrides);
    const a2 = m({ ...completeOverrides, nameKey: 'other' });

    expect(dropCoveredIncompletes([a1, a2])).toEqual([a1, a2]);
  });

  it('returns an empty list for an empty input', () => {
    expect(dropCoveredIncompletes([])).toEqual([]);
  });

  it('preserves the input order of the kept items', () => {
    const c1 = m({ ...completeOverrides, nameKey: 'c1' });
    const kept = m({ ...incompleteOverrides, year: 2020, nameKey: 'kept' });
    const covered = m(incompleteOverrides);
    const c2 = m({ ...completeOverrides, nameKey: 'c2' });

    expect(dropCoveredIncompletes([c1, kept, covered, c2])).toEqual([c1, kept, c2]);
  });
});
