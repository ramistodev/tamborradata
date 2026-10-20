import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { buildLandingTexts } from '@/app/(frontend)/[locale]/(landing)/data/buildLandingTexts';
import { makeGlobalOverview, makeLastOverview, makeOverviewResponse } from '@/test/fixtures/overview';
import { messagesByLocale, type TestLocale } from '@/test/helpers/messages';

function translator(locale: TestLocale) {
  return createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Landing.metadata',
  } as never) as any;
}

const fallbackDescription =
  'Archivo histórico y estadístico de la Tamborrada Infantil de Donostia: participaciones, nombres y colegios de cada edición, y un buscador de participantes.';

describe('buildLandingTexts', () => {
  describe('es', () => {
    const t = translator('es');

    it('builds the title and the description with the covered years', () => {
      expect(buildLandingTexts(t, makeOverviewResponse())).toEqual({
        title: 'Tamborradata',
        description:
          'Archivo histórico y estadístico de la Tamborrada Infantil de Donostia: participaciones, nombres y colegios de 2000 a 2025, y un buscador de participantes.',
      });
    });

    it.each([
      ['a null overview', null],
      ['an empty overview', {}],
      ['an overview without the global period', { lastPeriod: makeLastOverview() }],
    ])('falls back to the description without years for %s', (_name, overview) => {
      const result = buildLandingTexts(t, overview as never);

      expect(result.description).toBe(fallbackDescription);
    });

    it('interpolates the years as strings', () => {
      const overview = makeOverviewResponse({
        globalPeriod: makeGlobalOverview({ startYear: 1999, endYear: 2030 }),
      });

      const result = buildLandingTexts(t, overview);

      expect(result.description).toContain('1999');
      expect(result.description).toContain('2030');
    });
  });

  describe.each(['en', 'eu'] as const)('%s', (locale) => {
    const t = translator(locale);

    it('matches the translator output with an overview', () => {
      expect(buildLandingTexts(t, makeOverviewResponse())).toEqual({
        title: t('title'),
        description: t('description', { startYear: '2000', endYear: '2025' }),
      });
    });

    it('matches the translator fallback without an overview', () => {
      expect(buildLandingTexts(t, null)).toEqual({
        title: t('title'),
        description: t('descriptionFallback'),
      });
    });
  });
});
