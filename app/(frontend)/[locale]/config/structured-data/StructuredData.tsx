import { getLocale, getTranslations } from 'next-intl/server';
import type { OverviewResponse } from '../../../../types/api/overview.types';
import { getLanguageTag } from '../../../i18n/seo';
import { logoUrl, ogImageUrl, organizationId, siteName, siteUrl, webSiteId } from '../constants';
import { JsonLd } from './JsonLd';

const sameAs = ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'];

/**
 * The entities every page of the site points at: the organization and the website. They are
 * declared once, in the root layout, and each page references them by `@id`. The years come from
 * the published period; without it the description states none.
 */
export async function StructuredData({ overview }: { overview: OverviewResponse | null }) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Site.structuredData')]);
  const globalPeriod = overview?.globalPeriod;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    image: ogImageUrl,
    sameAs,
    description: t('organizationDescription'),
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': webSiteId,
    url: siteUrl,
    name: siteName,
    alternateName: t('websiteAlternateName'),
    description: globalPeriod
      ? t('websiteDescription', { startYear: String(globalPeriod.startYear) })
      : t('websiteDescriptionFallback'),
    inLanguage: getLanguageTag(locale),
    publisher: { '@id': organizationId },
    sameAs,
  };

  return (
    <>
      <JsonLd id="organization-structured-data" data={organization} />
      <JsonLd id="website-structured-data" data={webSite} />
    </>
  );
}
