import { describe, expect, it } from 'vitest';
import {
  CHAPTER_ORDER,
  CLOSING_CHAPTER_ID,
  HERO_CHAPTER_ID,
  sortFamilies,
} from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/chapters';
import { categoryFamilies } from '@/app/types/statistics';
import { makeFamily } from '@/test/fixtures/statistics';

describe('chapters', () => {
  it('exposes the hero and closing chapter ids', () => {
    expect(HERO_CHAPTER_ID).toBe('hero');
    expect(CLOSING_CHAPTER_ID).toBe('closing');
  });

  describe('CHAPTER_ORDER', () => {
    it('has an entry for every category family', () => {
      expect(Object.keys(CHAPTER_ORDER).sort()).toEqual(Object.values(categoryFamilies).sort());
    });

    it('keeps the page order of the families', () => {
      expect(CHAPTER_ORDER).toEqual({
        participationDynamics: 1,
        names: 2,
        surnames: 3,
        identityDiversity: 4,
        schools: 5,
        schoolsRenewal: 6,
        schoolsEvolution: 7,
      });
    });
  });

  describe('sortFamilies', () => {
    it('sorts families ascending by chapter order', () => {
      const reversed = [
        makeFamily('schoolsEvolution', []),
        makeFamily('schoolsRenewal', []),
        makeFamily('schools', []),
        makeFamily('identityDiversity', []),
        makeFamily('surnames', []),
        makeFamily('names', []),
        makeFamily('participationDynamics', []),
      ];

      expect(sortFamilies(reversed).map((family) => family.family)).toEqual([
        'participationDynamics',
        'names',
        'surnames',
        'identityDiversity',
        'schools',
        'schoolsRenewal',
        'schoolsEvolution',
      ]);
    });

    it('returns a new array and does not mutate the input', () => {
      const input = [makeFamily('schools', []), makeFamily('names', [])];

      const result = sortFamilies(input);

      expect(result).not.toBe(input);
      expect(input.map((family) => family.family)).toEqual(['schools', 'names']);
    });

    it('returns an empty array for an empty input', () => {
      expect(sortFamilies([])).toEqual([]);
    });
  });
});
