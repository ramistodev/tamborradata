import { getLocale } from 'next-intl/server';
import { getAlternates, getLanguageTag } from '../../../i18n/seo';
import { getArticleHrefs } from '../../(pages)/articles/data/slugs';
import type { Article } from '../../(pages)/articles/types/article.types';
import { ogImageUrl, organizationId, webSiteId } from '../constants';
import { JsonLd } from './JsonLd';

export async function ArticleStructuredData({ article }: { article: Article }) {
  const locale = await getLocale();
  const url = getAlternates(locale, getArticleHrefs(article.id)).canonical;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: getLanguageTag(locale),
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    isAccessibleForFree: true,
    articleSection: article.category,
    image: [ogImageUrl],
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
    isPartOf: { '@id': webSiteId },
  };

  return <JsonLd id={`article-structured-data-${article.id}`} data={data} />;
}
