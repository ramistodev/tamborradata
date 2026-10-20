import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import type { PeriodFacts } from '@/app/(frontend)/[locale]/config/structured-data/period/buildPeriodFacts';
import { buildPeriodTexts } from '@/app/(frontend)/[locale]/config/structured-data/period/buildPeriodTexts';
import { messagesByLocale, type TestLocale } from '@/test/helpers/messages';

function tools(locale: TestLocale) {
  const t = createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Statistics',
  } as never) as any;
  const format = createFormatter({ locale, timeZone: 'Europe/Madrid' } as never) as any;

  return { t, format };
}

function facts(overrides: Partial<PeriodFacts> = {}): PeriodFacts {
  return {
    period: '2024',
    kind: 'year',
    firstPeriod: '2000',
    lastPeriod: '2025',
    editions: 26,
    missingYears: [],
    participants: null,
    growth: null,
    recordYear: null,
    recordCount: null,
    distinctNames: null,
    distinctSurnames: null,
    multipleNames: null,
    multipleNamesRate: null,
    averageSchoolSize: null,
    schoolCount: null,
    topNames: [],
    topSurnames: [],
    topSchools: [],
    newNames: [],
    perennialNames: [],
    schoolLongevity: [],
    fastestGrowingSchool: null,
    ...overrides,
  };
}

const fourNames = ['Ane', 'Maite', 'Jon', 'Mikel'].map((label) => ({ label, value: 1 }));

describe('buildPeriodTexts', () => {
  describe('year period (es)', () => {
    const { t, format } = tools('es');

    it('builds the title from the period', () => {
      const result = buildPeriodTexts(facts(), t, format);

      expect(result.title).toBe('Estadísticas de la Tamborrada Infantil 2024');
      expect(result.title).toBe(t('period.title', { period: '2024' }));
    });

    it('builds the data description with the participants and the first three names', () => {
      const result = buildPeriodTexts(facts({ participants: 1234, topNames: fourNames }), t, format);

      expect(result.description).toBe(
        t('period.dataDescription', {
          period: '2024',
          participants: '1.234',
          names: format.list(['Ane', 'Maite', 'Jon'], { type: 'conjunction', style: 'long' }),
        })
      );
      expect(result.description).toContain('1.234');
      expect(result.description).not.toContain('Mikel');
    });

    it('uses the no-data description when there are no participants', () => {
      const result = buildPeriodTexts(facts({ participants: null, topNames: fourNames }), t, format);

      expect(result.description).toBe(t('period.description', { period: '2024' }));
    });

    it('uses the no-data description when there are participants but no top names', () => {
      const result = buildPeriodTexts(facts({ participants: 1234, topNames: [] }), t, format);

      expect(result.description).toBe(t('period.description', { period: '2024' }));
    });
  });

  describe('global period (es)', () => {
    const { t, format } = tools('es');

    it('builds the title from the covered range', () => {
      const result = buildPeriodTexts(facts({ period: 'global', kind: 'global' }), t, format);

      expect(result.title).toBe('Estadísticas históricas de la Tamborrada Infantil (2000-2025)');
    });

    it('builds the data description from the participants even without top names', () => {
      const result = buildPeriodTexts(
        facts({ period: 'global', kind: 'global', participants: 1234, topNames: [] }),
        t,
        format
      );

      expect(result.description).toBe(
        t('period.globalDataDescription', { first: '2000', last: '2025', participants: '1.234' })
      );
    });

    it('uses the no-data description when there are no participants', () => {
      const result = buildPeriodTexts(
        facts({ period: 'global', kind: 'global', participants: null }),
        t,
        format
      );

      expect(result.description).toBe(t('period.globalDescription', { first: '2000', last: '2025' }));
    });
  });

  describe.each(['en', 'eu'] as const)('year period with data (%s)', (locale) => {
    it('matches the translator and formatter of the locale', () => {
      const { t, format } = tools(locale);

      const result = buildPeriodTexts(facts({ participants: 1234, topNames: fourNames }), t, format);

      expect(result.title).toBe(t('period.title', { period: '2024' }));
      expect(result.description).toBe(
        t('period.dataDescription', {
          period: '2024',
          participants: format.number(1234, { useGrouping: 'always' }),
          names: format.list(['Ane', 'Maite', 'Jon'], { type: 'conjunction', style: 'long' }),
        })
      );
      expect(result.description).not.toContain('Mikel');
    });
  });
});
