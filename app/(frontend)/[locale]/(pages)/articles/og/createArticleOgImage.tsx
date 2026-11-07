import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/app/(frontend)/i18n/routing';
import { siteName, siteUrl } from '../../../config/constants';
import { getArticle } from '../data/getArticles';
import type { Article } from '../types/article.types';
import type { ArticleOgCardProps } from './ArticleOgCard';
import { loadArticleOgFonts } from './articleOgFonts';
import { renderArticleOg } from './renderArticleOg';

const logoPath = join(process.cwd(), 'public', 'logo-512x512.png');

export function findArticle(locale?: string, slug?: string): Article | undefined {
  if (!locale || !slug || !hasLocale(routing.locales, locale)) return undefined;
  return getArticle(locale, slug);
}

export function findArticleForOg(locale: string, slug: string): Article {
  const article = findArticle(locale, slug);
  if (!article) notFound();
  return article;
}

export function getOgHost(): string {
  return new URL(siteUrl).host;
}

export function getArticleOgProps(article: Article, logoSrc?: string): ArticleOgCardProps {
  return {
    title: article.title,
    description: article.description,
    category: article.category,
    readTime: article.readTime,
    host: getOgHost(),
    brand: siteName,
    logoSrc,
  };
}

async function readLogoSrc(): Promise<string | undefined> {
  try {
    return `data:image/png;base64,${await readFile(logoPath, 'base64')}`;
  } catch {
    return undefined;
  }
}

export async function createArticleOgImage(locale: string, slug: string) {
  const article = findArticleForOg(locale, slug);
  const props = getArticleOgProps(article, await readLogoSrc());
  const fonts = await loadArticleOgFonts(props);

  return renderArticleOg(props, fonts);
}
