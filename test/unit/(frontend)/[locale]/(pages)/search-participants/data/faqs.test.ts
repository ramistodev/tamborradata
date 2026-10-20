import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { buildFaqs } from '@/app/(frontend)/[locale]/(pages)/search-participants/data/faqs';
import { LOCALES, messagesByLocale, type TestLocale } from '@/test/helpers/messages';

function tools(locale: TestLocale) {
  const t = createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Search.faq.items',
  } as never) as any;
  const format = createFormatter({ locale, timeZone: 'Europe/Madrid' } as never) as any;

  return { t, format };
}

const order = [
  'scope',
  'requirements',
  'whySchool',
  'matchTypes',
  'multipleResults',
  'years',
  'sources',
  'notFound',
];
const fixedKeys = order.filter((key) => key !== 'years');
const yearsIndex = order.indexOf('years');

function overview(overrides: { missingYears?: number[] } = {}) {
  return { startYear: 2000, endYear: 2025, editionsCount: 25, missingYears: [2021], ...overrides };
}

describe('buildFaqs', () => {
  describe('es', () => {
    const { t, format } = tools('es');

    it('returns eight items in the documented order', () => {
      const items = buildFaqs(t, format, overview());

      expect(items).toHaveLength(8);
      expect(items.map((item) => item.question)).toEqual(
        order.map((key) =>
          key === 'years'
            ? t('years.question', {
                editionsCount: 25,
                startYear: '2000',
                endYear: '2025',
                hasGaps: 'yes',
                missingYears: '2021',
              })
            : t(`${key}.question`)
        )
      );
    });

    it('answers the years question with a gap', () => {
      const items = buildFaqs(t, format, overview({ missingYears: [2021] }));

      expect(items[yearsIndex]).toEqual({
        question: '¿De qué años hay datos?',
        answer: 'Hay datos de 25 ediciones, entre 2000 y 2025. No hay datos de 2021.',
      });
    });

    it('answers the years question without gaps', () => {
      const items = buildFaqs(t, format, overview({ missingYears: [] }));

      expect(items[yearsIndex].answer).toBe('Hay datos de 25 ediciones, entre 2000 y 2025.');
    });

    it('lists several missing years with a conjunction', () => {
      const items = buildFaqs(t, format, overview({ missingYears: [2021, 2022] }));

      expect(items[yearsIndex].answer.endsWith('No hay datos de 2021 y 2022.')).toBe(true);
    });

    it.each([
      ['null', null],
      ['undefined', undefined],
    ])('uses the fallback years item for %s', (_name, value) => {
      const items = buildFaqs(t, format, value);

      expect(items).toHaveLength(8);
      expect(items[yearsIndex]).toEqual({
        question: t('yearsFallback.question'),
        answer: t('yearsFallback.answer'),
      });
    });

    it('translates the other seven items straight from their keys', () => {
      const items = buildFaqs(t, format, overview());

      fixedKeys.forEach((key) => {
        const index = order.indexOf(key);

        expect(items[index]).toEqual({
          question: t(`${key}.question`),
          answer: t(`${key}.answer`),
        });
      });
    });
  });

  describe.each(LOCALES)('%s', (locale) => {
    const { t, format } = tools(locale);

    it.each([
      ['with an overview', overview()],
      ['without an overview', null],
    ])('returns non-empty questions and answers %s', (_name, value) => {
      const items = buildFaqs(t, format, value);

      expect(items).toHaveLength(8);
      for (const item of items) {
        expect(typeof item.question).toBe('string');
        expect(item.question.length).toBeGreaterThan(0);
        expect(typeof item.answer).toBe('string');
        expect(item.answer.length).toBeGreaterThan(0);
      }
    });
  });
});
