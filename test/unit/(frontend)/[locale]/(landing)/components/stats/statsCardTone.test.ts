import { describe, expect, it } from 'vitest';

import { statsCardTones } from '@/app/(frontend)/[locale]/(landing)/components/stats/statsCardTone';

const toneKeys = ['badge', 'bar', 'card', 'count', 'cta', 'divider', 'muted', 'note', 'strong'];

describe('statsCardTones', () => {
  it('defines exactly the accent and surface tones', () => {
    expect(Object.keys(statsCardTones).sort()).toEqual(['accent', 'surface']);
  });

  describe.each(Object.entries(statsCardTones))('%s tone', (_name, tone) => {
    it('has exactly the expected keys', () => {
      expect(Object.keys(tone).sort()).toEqual(toneKeys);
    });

    it('has a non-empty class string for every key', () => {
      for (const value of Object.values(tone)) {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      }
    });

    it('writes every class out in full, without interpolation', () => {
      for (const value of Object.values(tone)) {
        expect(value).not.toContain('${');
      }
    });
  });

  it('paints the surface card with the secondary background', () => {
    expect(statsCardTones.surface.card).toContain('bg-bg-secondary');
  });

  it('paints the accent card with the accent background', () => {
    expect(statsCardTones.accent.card).toContain('bg-accent');
  });
});
