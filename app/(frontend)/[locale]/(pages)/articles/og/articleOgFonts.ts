import { ogFontFamily } from '../../../config/og/constants';
import { loadOgFonts } from '../../../config/og/loadGoogleFont';
import type { OgFont } from '../../../config/og/loadGoogleFont';
import type { ArticleOgCardProps } from './ArticleOgCard';

export function loadArticleOgFonts({
  title,
  description,
  category,
  readTime,
  host,
  brand,
}: ArticleOgCardProps): Promise<OgFont[]> {
  const mono = `${category}${category.toUpperCase()}${readTime}${host}`;

  return loadOgFonts([
    { family: ogFontFamily.title, weight: 700, text: `${title}${brand}…` },
    { family: ogFontFamily.body, weight: 400, text: `${description}…` },
    { family: ogFontFamily.mono, weight: 500, text: mono },
  ]);
}
