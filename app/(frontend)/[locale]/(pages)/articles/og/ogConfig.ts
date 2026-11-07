export const articleOgTitleSizes = [
  { maxLength: 44, fontSize: 68 },
  { maxLength: 62, fontSize: 60 },
  { maxLength: 80, fontSize: 54 },
  { maxLength: Infinity, fontSize: 48 },
] as const;

export const articleOgLayout = {
  titleLineHeight: 1.12,
  titleLetterSpacing: -1.5,
  titleMaxLines: 3,
  descriptionFontSize: 26,
  descriptionLineHeight: 1.45,
  descriptionMaxLines: 3,
  accentBarWidth: 8,
  frameInset: 24,
  frameRadius: 28,
  logoSize: 46,
} as const;

export function getArticleOgTitleSize(title: string): number {
  const match = articleOgTitleSizes.find(({ maxLength }) => title.length <= maxLength);
  return match?.fontSize ?? articleOgTitleSizes[articleOgTitleSizes.length - 1].fontSize;
}
