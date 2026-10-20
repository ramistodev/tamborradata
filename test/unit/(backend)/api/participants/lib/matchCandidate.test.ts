import { describe, expect, it } from 'vitest';
import { matchCandidate } from '@/app/(backend)/api/participants/lib/matchCandidate';
import { toUnits } from '@/app/(backend)/api/participants/lib/particles';
import type { Candidate } from '@/app/(backend)/api/participants/types';

const candidate = (overrides: Partial<Candidate> = {}): Candidate => ({
  name: 'Ana Maria Garcia Lopez',
  nameKey: 'ana maria garcia lopez',
  year: 2024,
  url: null,
  school: { canonicalName: 'S', schoolKey: 's' },
  names: ['ana', 'maria'],
  surnames: ['garcia', 'lopez'],
  isIncomplete: false,
  ...overrides,
});

describe('matchCandidate', () => {
  describe('complete candidate', () => {
    it.each([
      [['ana', 'maria', 'garcia', 'lopez'], 'exact'],
      [['ana', 'garcia', 'lopez'], 'compatible'],
      [['maria', 'garcia', 'lopez'], 'compatible'],
      [['ana', 'garcia'], 'compatible'],
      [['ana', 'lopez', 'garcia'], 'incompatible'],
      [['ana', 'lopez'], 'incompatible'],
      [['ana', 'maria', 'garcia', 'lopez', 'perez'], 'incompatible'],
      [['ana'], 'incompatible'],
      [[], 'incompatible'],
    ])('matches %j as %s', (query, expected) => {
      expect(matchCandidate(query, candidate())).toBe(expected);
    });
  });

  describe('incomplete candidate', () => {
    const incomplete = candidate({
      nameKey: 'ana garcia',
      names: ['ana'],
      surnames: ['garcia'],
      isIncomplete: true,
    });

    it.each([
      [['ana', 'garcia', 'perez'], 'compatible'],
      [['ana', 'garcia'], 'exact'],
      [['ana', 'perez'], 'incompatible'],
    ])('matches %j as %s', (query, expected) => {
      expect(matchCandidate(query, incomplete)).toBe(expected);
    });
  });

  describe('single unit candidate', () => {
    it('matches the exact key', () => {
      const single = candidate({ nameKey: 'ana', names: [], surnames: [], isIncomplete: false });

      expect(matchCandidate(['ana'], single)).toBe('exact');
    });
  });

  describe('compound surname', () => {
    it('matches units built by toUnits', () => {
      const compound = candidate({
        nameKey: 'ana ramos de la fuente',
        names: ['ana'],
        surnames: ['ramos', 'de la fuente'],
      });

      expect(matchCandidate(toUnits(['ana', 'ramos', 'de', 'la', 'fuente']), compound)).toBe('exact');
    });
  });
});
