import type { Locale } from '@/app/types/locale';
import type { Article, ArticleTexts } from '../types/article.types';
import { articles } from './articles';
import { texts as namesTexts } from './content/cada-vez-es-mas-dificil-llamarse-como-los-demas';
import { texts as noraTexts } from './content/del-puesto-73-al-primero-como-nora-se-extendio-por-la-tamborrada-infantil';
import { texts as pipelineTexts } from './content/detras-de-cada-dato-hay-una-historia-y-un-problema-que-resolver';
import { texts as surnamesKeepTexts } from './content/donostia-cambia-de-nombres-pero-conserva-sus-apellidos';
import { getArticleIds, getIdBySlug, getSlug } from './slugs';
import type { ArticleId } from './slugs';

const articleTexts: Record<ArticleId, Record<Locale, ArticleTexts>> = {
  'cada-vez-es-mas-dificil-llamarse-como-los-demas': namesTexts,
  'detras-de-cada-dato-hay-una-historia-y-un-problema-que-resolver': pipelineTexts,
  'donostia-cambia-de-nombres-pero-conserva-sus-apellidos': surnamesKeepTexts,
  'del-puesto-73-al-primero-como-nora-se-extendio-por-la-tamborrada-infantil': noraTexts,
};

export function getArticleSlugs(locale: Locale): string[] {
  return getArticleIds().map((id) => getSlug(id, locale));
}

export function getArticleById(locale: Locale, id: ArticleId): Article | undefined {
  const base = articles.find((article) => article.id === id);
  const texts = articleTexts[id][locale];

  return base ? { ...base, ...texts, slug: getSlug(id, locale) } : undefined;
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  const id = getIdBySlug(locale, slug);
  return id ? getArticleById(locale, id) : undefined;
}

export function getArticles(locale: Locale, limit?: number): Article[] {
  return articles
    .flatMap(({ id }) => getArticleById(locale, id) ?? [])
    .sort(
      (a, b) =>
        Number(!!b.hilighted) - Number(!!a.hilighted) ||
        b.publishedAt.localeCompare(a.publishedAt) ||
        a.id.localeCompare(b.id)
    )
    .slice(0, limit);
}
