import { ImageResponse } from 'next/og';
import { ogSize } from '../../../config/og/constants';
import type { OgFont } from '../../../config/og/loadGoogleFont';
import { ArticleOgCard } from './ArticleOgCard';
import type { ArticleOgCardProps } from './ArticleOgCard';

export function renderArticleOg(props: ArticleOgCardProps, fonts: OgFont[]): ImageResponse {
  return new ImageResponse(<ArticleOgCard {...props} />, {
    ...ogSize,
    fonts: fonts.length > 0 ? fonts : undefined,
  });
}
