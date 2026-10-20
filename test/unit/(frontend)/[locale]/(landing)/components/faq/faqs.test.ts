import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { buildLandingFaqs } from '@/app/(frontend)/[locale]/(landing)/components/faq/faqs';
import {
  makeGlobalOverview,
  makeLastOverview,
  makeOverviewResponse,
} from '@/test/fixtures/overview';
import { LOCALES, messagesByLocale, type TestLocale } from '@/test/helpers/messages';

function tools(locale: TestLocale) {
  const t = createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Landing.faq.items',
  } as never) as any;
  const format = createFormatter({ locale, timeZone: 'Europe/Madrid' } as never) as any;
  const count = (n: number) => format.number(n, { useGrouping: 'always' }) as string;

  return { t, format, count };
}

const order = [
  'what',
  'howMany',
  'topName',
  'topSurname',
  'topSchool',
  'when',
  'find',
  'register',
  'years',
  'notFound',
  'sources',
  'updates',
  'participation',
  'correction',
  'openSource',
];
const fixedKeys = ['when', 'find', 'register', 'notFound', 'sources', 'participation', 'openSource'];

describe('buildLandingFaqs', () => {
  const { t, format, count } = tools('es');
  const answerOf = (key: string, overview: Parameters<typeof buildLandingFaqs>[2]) =>
    buildLandingFaqs(t, format, overview)[order.indexOf(key)].answer;

  it('returns fifteen items in the documented order', () => {
    const items = buildLandingFaqs(t, format, makeOverviewResponse());

    expect(items).toHaveLength(15);
    expect(items.map((item) => item.question)).toEqual(order.map((key) => t(`${key}.question`)));
  });

  describe('with the full default overview', () => {
    const overview = makeOverviewResponse();

    it('answers the top name, surname and school with grouped counts', () => {
      expect(answerOf('topName', overview)).toBe(
        t('topName.answer', { name: 'Ane', count: count(1200) })
      );
      expect(answerOf('topSurname', overview)).toBe(
        t('topSurname.answer', { surname: 'Garcia', count: count(2400) })
      );
      expect(answerOf('topSchool', overview)).toBe(
        t('topSchool.answer', { school: 'Ikastola Test', count: count(3100) })
      );
    });

    it('answers what with the start year', () => {
      expect(answerOf('what', overview)).toBe(
        t('what.answer', { hasStart: 'yes', startYear: '2000' })
      );
    });

    it('answers years without gaps', () => {
      expect(answerOf('years', overview)).toBe(
        t('years.answer', {
          editions: 26,
          startYear: '2000',
          endYear: '2025',
          hasGaps: 'no',
          missingYears: '',
        })
      );
    });

    it('answers years with gaps and lists the missing ones', () => {
      const withGaps = makeOverviewResponse({
        globalPeriod: makeGlobalOverview({ missingYears: [2021] }),
      });

      expect(answerOf('years', withGaps)).toBe(
        t('years.answer', {
          editions: 26,
          startYear: '2000',
          endYear: '2025',
          hasGaps: 'yes',
          missingYears: format.list(['2021'], { type: 'conjunction' }),
        })
      );
    });

    it('answers updates with the last year', () => {
      expect(answerOf('updates', overview)).toBe(
        t('updates.answer', { hasLast: 'yes', year: '2025' })
      );
    });

    it('answers correction with the contact email', () => {
      const answer = answerOf('correction', overview);

      expect(answer).toBe(t('correction.answer', { email: 'contact@tamborradata.com' }));
      expect(answer).toContain('contact@tamborradata.com');
    });
  });

  describe('howMany answer', () => {
    const lastPart = t('howMany.last', { year: '2025', participations: count(2100), schools: 60 });
    const growthPart = t('howMany.growth', {
      change: format.number(5 / 100, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: 'exceptZero',
      }),
    });
    const totalPart = t('howMany.total', {
      participations: count(52340),
      editions: 26,
      schools: 87,
    });
    const note = t('howMany.note');

    it('joins last, growth, total and note with single spaces', () => {
      expect(answerOf('howMany', makeOverviewResponse())).toBe(
        [lastPart, growthPart, totalPart, note].join(' ')
      );
    });

    it('omits the growth part when the growth rate is null', () => {
      const overview = makeOverviewResponse({
        lastPeriod: makeLastOverview({ growthRate: null }),
      });

      expect(answerOf('howMany', overview)).toBe([lastPart, totalPart, note].join(' '));
    });

    it('keeps only total and note without the last period', () => {
      const overview = makeOverviewResponse({ lastPeriod: undefined });

      expect(answerOf('howMany', overview)).toBe([totalPart, note].join(' '));
    });

    it('keeps last, growth and note without the global period', () => {
      const overview = makeOverviewResponse({ globalPeriod: undefined });

      expect(answerOf('howMany', overview)).toBe([lastPart, growthPart, note].join(' '));
    });

    it('uses only the fallback without any period', () => {
      const overview = makeOverviewResponse({ globalPeriod: undefined, lastPeriod: undefined });

      expect(answerOf('howMany', overview)).toBe(t('howMany.fallback'));
    });
  });

  describe('with a null overview', () => {
    it('falls back to the figure-free texts', () => {
      expect(answerOf('topName', null)).toBe(t('topName.fallback'));
      expect(answerOf('topSurname', null)).toBe(t('topSurname.fallback'));
      expect(answerOf('topSchool', null)).toBe(t('topSchool.fallback'));
      expect(answerOf('years', null)).toBe(t('years.fallback'));
      expect(answerOf('what', null)).toBe(t('what.answer', { hasStart: 'no', startYear: '' }));
      expect(answerOf('updates', null)).toBe(t('updates.answer', { hasLast: 'no', year: '' }));
    });
  });

  describe('fixed items', () => {
    it.each(fixedKeys)('answers %s with the same text for everybody', (key) => {
      expect(answerOf(key, makeOverviewResponse())).toBe(t(`${key}.answer`));
      expect(answerOf(key, null)).toBe(t(`${key}.answer`));
    });
  });

  describe.each(LOCALES)('%s', (locale) => {
    const localized = tools(locale);

    it.each([
      ['with an overview', makeOverviewResponse()],
      ['without an overview', null],
    ])('returns non-empty questions and answers %s', (_name, overview) => {
      const items = buildLandingFaqs(localized.t, localized.format, overview);

      expect(items).toHaveLength(15);
      for (const item of items) {
        expect(typeof item.question).toBe('string');
        expect(item.question.length).toBeGreaterThan(0);
        expect(typeof item.answer).toBe('string');
        expect(item.answer.length).toBeGreaterThan(0);
      }
    });
  });
});
