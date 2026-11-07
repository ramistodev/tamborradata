import type { Locale } from '@/app/types/locale';

export const articleSlugs = {
  'cada-vez-es-mas-dificil-llamarse-como-los-demas': {
    es: 'cada-vez-es-mas-dificil-llamarse-como-los-demas',
    en: 'it-is-getting-harder-to-share-a-name-with-anyone-else',
    eu: 'gero-eta-zailagoa-da-besteen-izen-bera-izatea',
  },
  'unai-garcia-lo-que-nuestros-nombres-y-apellidos-cuentan-sobre-donostia': {
    es: 'unai-garcia-lo-que-nuestros-nombres-y-apellidos-cuentan-sobre-donostia',
    en: 'unai-garcia-what-our-first-names-and-surnames-say-about-donostia',
    eu: 'unai-garcia-gure-izen-abizenek-donostiari-buruz-zer-kontatzen-duten',
  },
  'detras-de-cada-dato-hay-una-historia-y-un-problema-que-resolver': {
    es: 'detras-de-cada-dato-hay-una-historia-y-un-problema-que-resolver',
    en: 'behind-every-piece-of-data-there-is-a-story-and-a-problem-to-solve',
    eu: 'datu-bakoitzaren-atzean-istorio-bat-dago-eta-konpondu-beharreko-arazo-bat',
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type ArticleId = keyof typeof articleSlugs;

const articleIds = Object.keys(articleSlugs) as ArticleId[];

export function getArticleIds(): ArticleId[] {
  return articleIds;
}

export function getSlug(id: ArticleId, locale: Locale): string {
  return articleSlugs[id][locale];
}

export function getSlugs(id: ArticleId): Record<Locale, string> {
  return articleSlugs[id];
}

export function getIdBySlug(locale: Locale, slug: string): ArticleId | undefined {
  return articleIds.find((id) => articleSlugs[id][locale] === slug);
}

export function getIdByAnySlug(slug: string): ArticleId | undefined {
  return articleIds.find((id) => Object.values<string>(articleSlugs[id]).includes(slug));
}

export function getArticleHrefs(id: ArticleId): Record<Locale, string> {
  const { es, en, eu } = articleSlugs[id];
  return { es: `/articles/${es}`, en: `/articles/${en}`, eu: `/articles/${eu}` };
}
