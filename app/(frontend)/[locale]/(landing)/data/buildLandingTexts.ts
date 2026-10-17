import type { useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../types/api/overview.types';

type MetadataTranslator = ReturnType<typeof useTranslations<'Landing.metadata'>>;

/**
 * Title and description of the landing, shared by the page metadata and the structured data so
 * Google reads the same thing in both. The covered years come from the published period; without
 * it the description falls back to a text that states no years.
 *
 * `t` is scoped to `Landing.metadata` and works with both `useTranslations` and `getTranslations`.
 */
export function buildLandingTexts(t: MetadataTranslator, overview: OverviewResponse | null) {
  const globalPeriod = overview?.globalPeriod;

  return {
    title: t('title'),
    description: globalPeriod
      ? t('description', {
          startYear: String(globalPeriod.startYear),
          endYear: String(globalPeriod.endYear),
        })
      : t('descriptionFallback'),
  };
}
