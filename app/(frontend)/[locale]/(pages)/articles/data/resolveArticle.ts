import { notFound } from 'next/navigation';
import { permanentRedirect } from '@/app/(frontend)/i18n/navigation';
import type { Locale } from '@/app/types/locale';
import type { Article } from '../types/article.types';
import { getArticle } from './getArticles';
import { getIdByAnySlug, getSlug } from './slugs';

export function resolveArticle(locale: Locale, slug: string): Article {
  const article = getArticle(locale, slug);
  if (article) return article;

  const id = getIdByAnySlug(slug);
  if (id) permanentRedirect({ href: `/articles/${getSlug(id, locale)}`, locale });

  notFound();
}
