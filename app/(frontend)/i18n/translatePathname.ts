import type { Locale } from '@/app/types/locale';
import { getIdBySlug, getSlug } from '../[locale]/(pages)/articles/data/slugs';

const ARTICLE_PATH = /^\/articles\/([^/]+)\/?$/;

export function translatePathname(pathname: string, fromLocale: Locale, toLocale: Locale): string {
  const slug = ARTICLE_PATH.exec(pathname)?.[1];
  if (!slug) return pathname;

  const id = getIdBySlug(fromLocale, slug);
  return id ? `/articles/${getSlug(id, toLocale)}` : pathname;
}
