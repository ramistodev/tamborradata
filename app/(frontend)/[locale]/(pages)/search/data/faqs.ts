import type { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import type { FAQItem } from '../../../components/ui';

type FAQPeriod = Pick<
  NonNullable<OverviewResponse['globalPeriod']>,
  'startYear' | 'endYear' | 'editionsCount' | 'missingYears'
>;

type FaqTranslator = ReturnType<typeof useTranslations<'Search.faq.items'>>;
type FaqFormatter = ReturnType<typeof useFormatter>;

const FAQ_KEYS = [
  'scope',
  'requirements',
  'whySchool',
  'matchTypes',
  'multipleResults',
  'years',
  'sources',
  'notFound',
] as const;

/**
 * The search page FAQs, translated. The years come from the published period, so they stay true
 * when a new edition is added. The rest describes how the search and the data work today: if the
 * matching rules (`api/participants`) or the sources change, update the answers too.
 *
 * `t` is scoped to `Search.faq.items` and works with both `useTranslations` and `getTranslations`.
 */
export function buildFaqs(
  t: FaqTranslator,
  format: FaqFormatter,
  { startYear, endYear, editionsCount, missingYears }: FAQPeriod
): FAQItem[] {
  const values = {
    editionsCount,
    startYear: String(startYear),
    endYear: String(endYear),
    hasGaps: missingYears.length > 0 ? 'yes' : 'no',
    missingYears: format.list(missingYears.map(String), { type: 'conjunction' }),
  };

  return FAQ_KEYS.map((key) => ({
    question: t(`${key}.question`, values),
    answer: t(`${key}.answer`, values),
  }));
}
