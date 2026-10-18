import { getLocale, getTranslations } from 'next-intl/server';
import { getAlternates, getLanguageTag } from '../../../i18n/seo';
import {
  PRIVACY_POLICY_PUBLISHED,
  PRIVACY_POLICY_UPDATED,
} from '../../(pages)/privacy-policy/data/constants';
import { ogImageUrl, organizationId, webSiteId } from '../constants';
import { JsonLd } from './JsonLd';

/**
 * Structured data of the privacy policy, as one `@graph` like the other pages: the page and its
 * breadcrumb. The texts come from the same translations as the metadata and the dates from the same
 * constants as the visible "updated on" line, so what Google reads is what the page shows.
 */
export async function PolicyPrivacyStructuredData() {
  const [locale, t, tMetadata] = await Promise.all([
    getLocale(),
    getTranslations('PrivacyPolicy.structuredData'),
    getTranslations('PrivacyPolicy.metadata'),
  ]);

  const url = getAlternates(locale, '/privacy-policy').canonical;
  const ids = {
    webPage: `${url}#webpage`,
    breadcrumb: `${url}#breadcrumb`,
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': ids.webPage,
    url,
    name: tMetadata('title'),
    description: tMetadata('description'),
    inLanguage: getLanguageTag(locale),
    isAccessibleForFree: true,
    isPartOf: { '@id': webSiteId },
    publisher: { '@id': organizationId },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImageUrl },
    breadcrumb: { '@id': ids.breadcrumb },
    datePublished: PRIVACY_POLICY_PUBLISHED,
    dateModified: PRIVACY_POLICY_UPDATED,
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('home'),
        item: getAlternates(locale, '/').canonical,
      },
      { '@type': 'ListItem', position: 2, name: tMetadata('title'), item: url },
    ],
  };

  return (
    <JsonLd
      id="privacy-policy-structured-data"
      data={{
        '@context': 'https://schema.org',
        '@graph': [webPage, breadcrumb],
      }}
    />
  );
}
