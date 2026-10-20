import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { buildSearchTexts } from '@/app/(frontend)/[locale]/(pages)/search-participants/data/buildSearchTexts';
import { makeGlobalOverview } from '@/test/fixtures/overview';
import { messagesByLocale, type TestLocale } from '@/test/helpers/messages';

function translator(locale: TestLocale) {
  return createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Search.metadata',
  } as never) as any;
}

describe('buildSearchTexts', () => {
  describe('es', () => {
    const t = translator('es');

    it('builds the title and the description with the covered years', () => {
      expect(buildSearchTexts(t, makeGlobalOverview())).toEqual({
        title: 'Buscar participante de la Tamborrada Infantil de Donostia',
        description:
          'Busca participantes de la Tamborrada Infantil de Donostia por nombre y colegio y mira en qué años salieron. Ediciones de 2000 a 2025.',
      });
    });

    it.each([
      ['undefined', undefined],
      ['null', null],
    ])('falls back to the description without years for %s', (_name, globalPeriod) => {
      const result = buildSearchTexts(t, globalPeriod as never);

      expect(result.description).toBe(
        'Busca participantes de la Tamborrada Infantil de Donostia por nombre y colegio y mira en qué años salieron, con enlace a la fuente original.'
      );
    });
  });

  describe.each(['en', 'eu'] as const)('%s', (locale) => {
    const t = translator(locale);

    it('matches the translator output with a global period', () => {
      expect(buildSearchTexts(t, makeGlobalOverview())).toEqual({
        title: t('title'),
        description: t('description', { startYear: '2000', endYear: '2025' }),
      });
    });

    it('matches the translator fallback without a global period', () => {
      expect(buildSearchTexts(t, null as never)).toEqual({
        title: t('title'),
        description: t('descriptionFallback'),
      });
    });
  });
});
