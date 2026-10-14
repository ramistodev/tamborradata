import type { useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';

type SearchPeriod = Pick<NonNullable<OverviewResponse['globalPeriod']>, 'startYear' | 'endYear'>;

type MetadataTranslator = ReturnType<typeof useTranslations<'Search.metadata'>>;

/**
 * Title and description of the search page, shared by the page metadata and the structured data so
 * Google reads the same thing in both. The covered years come from the published period; without
 * it the description falls back to a text that states no years.
 *
 * `t` is scoped to `Search.metadata` and works with both `useTranslations` and `getTranslations`.
 */
export function buildSearchTexts(t: MetadataTranslator, period?: SearchPeriod) {
  return {
    title: t('title'),
    description: period
      ? t('description', { startYear: String(period.startYear), endYear: String(period.endYear) })
      : t('descriptionFallback'),
  };
}
