import { hasLocale } from 'next-intl';
import { routing } from '@/app/(frontend)/i18n/routing';
import { getArticleSlugs } from './getArticles';

export function getArticleStaticParams(locale: string): { slug: string }[] {
  if (!hasLocale(routing.locales, locale)) return [];
  return getArticleSlugs(locale).map((slug) => ({ slug }));
}
