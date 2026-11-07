import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getAlternates, getOpenGraphLocales } from '@/app/(frontend)/i18n/seo';
import { siteName } from '../../../config/constants';
import { ArticleStructuredData } from '../../../config/structured-data/ArticleStructuredData';
import { getArticleHrefs } from '../data/slugs';
import { resolveArticle } from '../data/resolveArticle';
import { PageContent } from './PageContent';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const article = resolveArticle(locale, slug);

  const { title, description } = article;
  const alternates = getAlternates(locale, getArticleHrefs(article.id));

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      ...getOpenGraphLocales(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@tamborradata',
      creator: '@tamborradata',
    },
  };
}

export default async function ArticleContentPage({ params }: { params: Params }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const article = resolveArticle(locale, slug);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <ArticleStructuredData article={article} />
      <PageContent article={article} />
    </div>
  );
}
