import type { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import type { FAQItem } from '../../../components/ui';

type GlobalPeriod = NonNullable<OverviewResponse['globalPeriod']>;
type PeriodOverview = Pick<GlobalPeriod, 'startYear' | 'endYear' | 'editionsCount' | 'missingYears'>;

type FaqTranslator = ReturnType<typeof useTranslations<'Search.faq.items'>>;
type FaqFormatter = ReturnType<typeof useFormatter>;

const KEYS_BEFORE_YEARS = [
  'scope',
  'requirements',
  'whySchool',
  'matchTypes',
  'multipleResults',
] as const;
const KEYS_AFTER_YEARS = ['sources', 'notFound'] as const;

/** The years question needs the published period; without it, a text that states no figures takes its place. */
function buildYearsFaq(
  t: FaqTranslator,
  format: FaqFormatter,
  periodOverview?: PeriodOverview | null
): FAQItem {
  if (!periodOverview) {
    return { question: t('yearsFallback.question'), answer: t('yearsFallback.answer') };
  }

  const values = {
    editionsCount: periodOverview.editionsCount,
    startYear: String(periodOverview.startYear),
    endYear: String(periodOverview.endYear),
    hasGaps: periodOverview.missingYears.length > 0 ? 'yes' : 'no',
    missingYears: format.list(periodOverview.missingYears.map(String), { type: 'conjunction' }),
  };

  return { question: t('years.question', values), answer: t('years.answer', values) };
}

/**
 * The search page FAQs, translated. The years come from the published period, so they stay true
 * when a new edition is added; if the overview failed to load (`periodOverview` is null or
 * undefined) that one question is replaced by a text with no figures. The rest describes how the
 * search and the data work today: if the matching rules (`api/participants`) or the sources
 * change, update the answers too.
 *
 * `t` is scoped to `Search.faq.items` and works with both `useTranslations` and `getTranslations`.
 */
export function buildFaqs(
  t: FaqTranslator,
  format: FaqFormatter,
  periodOverview?: PeriodOverview | null
): FAQItem[] {
  const toItem = (key: (typeof KEYS_BEFORE_YEARS | typeof KEYS_AFTER_YEARS)[number]): FAQItem => ({
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  });

  return [
    ...KEYS_BEFORE_YEARS.map(toItem),
    buildYearsFaq(t, format, periodOverview),
    ...KEYS_AFTER_YEARS.map(toItem),
  ];
}
