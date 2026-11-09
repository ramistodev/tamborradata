import type { ArticleId } from './slugs';

/**
 * Articles that were deleted but are still indexed. Each old slug (every locale) keeps answering
 * with a permanent redirect to the article that now covers the same ground.
 *
 * Keep these entries indefinitely: dropping one turns an indexed URL into a 404.
 */
export const retiredArticleSlugs: Record<string, ArticleId> = {
  // unai-garcia-lo-que-nuestros-nombres-y-apellidos-cuentan-sobre-donostia
  'unai-garcia-lo-que-nuestros-nombres-y-apellidos-cuentan-sobre-donostia':
    'donostia-cambia-de-nombres-pero-conserva-sus-apellidos',
  'unai-garcia-what-our-first-names-and-surnames-say-about-donostia':
    'donostia-cambia-de-nombres-pero-conserva-sus-apellidos',
  'unai-garcia-gure-izen-abizenek-donostiari-buruz-zer-kontatzen-duten':
    'donostia-cambia-de-nombres-pero-conserva-sus-apellidos',
};
