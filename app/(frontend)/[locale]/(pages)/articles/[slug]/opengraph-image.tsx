import { ogContentType, ogSize } from '../../../config/og/constants';
import { createArticleOgImage, findArticle } from '../og/createArticleOgImage';

type Params = { locale: string; slug: string };

export function generateImageMetadata({ params }: { params: Partial<Params> }) {
  const article = findArticle(params.locale, params.slug);

  return article
    ? [{ id: 'article', alt: article.title, size: ogSize, contentType: ogContentType }]
    : [];
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  return createArticleOgImage(locale, slug);
}
