import type { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { contactEmail } from '../../../config/constants';
import type { FAQItem } from '../../../components/ui';

type FaqTranslator = ReturnType<typeof useTranslations<'Landing.faq.items'>>;
type FaqFormatter = ReturnType<typeof useFormatter>;

/** Questions whose answer is the same text for everybody. */
type StaticFaqKey =
  'when' | 'find' | 'register' | 'notFound' | 'sources' | 'participation' | 'openSource';

/**
 * The landing FAQs, translated and written as the questions people type into a search engine. Every
 * figure comes from the overview, so the answers stay true with each new edition; when the overview
 * did not load, each one falls back to a text that states no figures.
 *
 * `t` is scoped to `Landing.faq.items` and works with both `useTranslations` and `getTranslations`.
 */
export function buildLandingFaqs(
  t: FaqTranslator,
  format: FaqFormatter,
  overview: OverviewResponse | null
): FAQItem[] {
  const global = overview?.globalPeriod;
  const last = overview?.lastPeriod;

  // 'always': Spanish skips the thousands separator on 4-digit numbers (5149) by default
  const count = (value: number) => format.number(value, { useGrouping: 'always' });

  const fixed = (key: StaticFaqKey): FAQItem => ({
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  });

  const missingYears = global?.missingYears.map(String) ?? [];

  return [
    {
      question: t('what.question'),
      answer: t('what.answer', {
        hasStart: global ? 'yes' : 'no',
        startYear: String(global?.startYear ?? ''),
      }),
    },
    {
      question: t('howMany.question'),
      answer: buildHowManyAnswer(t, format, count, overview),
    },
    {
      question: t('topName.question'),
      answer: global
        ? t('topName.answer', { name: global.topName.label, count: count(global.topName.count) })
        : t('topName.fallback'),
    },
    {
      question: t('topSurname.question'),
      answer: global
        ? t('topSurname.answer', {
            surname: global.topSurname.label,
            count: count(global.topSurname.count),
          })
        : t('topSurname.fallback'),
    },
    {
      question: t('topSchool.question'),
      answer: global
        ? t('topSchool.answer', {
            school: global.topSchool.label,
            count: count(global.topSchool.count),
          })
        : t('topSchool.fallback'),
    },
    fixed('when'),
    fixed('find'),
    fixed('register'),
    {
      question: t('years.question'),
      answer: global
        ? t('years.answer', {
            editions: global.editionsCount,
            startYear: String(global.startYear),
            endYear: String(global.endYear),
            hasGaps: missingYears.length > 0 ? 'yes' : 'no',
            missingYears: format.list(missingYears, { type: 'conjunction' }),
          })
        : t('years.fallback'),
    },
    fixed('notFound'),
    fixed('sources'),
    {
      question: t('updates.question'),
      answer: t('updates.answer', {
        hasLast: last ? 'yes' : 'no',
        year: String(last?.year ?? ''),
      }),
    },
    fixed('participation'),
    {
      question: t('correction.question'),
      answer: t('correction.answer', { email: contactEmail }),
    },
    fixed('openSource'),
  ];
}

/** Last edition and whole history, each only when its period is available. */
function buildHowManyAnswer(
  t: FaqTranslator,
  format: FaqFormatter,
  count: (value: number) => string,
  overview: OverviewResponse | null
): string {
  const global = overview?.globalPeriod;
  const last = overview?.lastPeriod;
  const parts: string[] = [];

  if (last) {
    parts.push(
      t('howMany.last', {
        year: String(last.year),
        participations: count(last.totalParticipations),
        schools: last.totalSchools,
      })
    );

    if (last.growthRate !== null) {
      // The backend sends percentages as 2.89, not 0.0289
      const change = format.number(last.growthRate / 100, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: 'exceptZero',
      });
      parts.push(t('howMany.growth', { change }));
    }
  }

  if (global) {
    parts.push(
      t('howMany.total', {
        participations: count(global.totalParticipations),
        editions: global.editionsCount,
        schools: global.totalSchools,
      })
    );
  }

  if (parts.length === 0) return t('howMany.fallback');

  // A participation is a record in an edition, not a different person
  parts.push(t('howMany.note'));
  return parts.join(' ');
}
