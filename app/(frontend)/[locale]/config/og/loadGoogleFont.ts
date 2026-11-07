import type { OgFontFamily } from './constants';

export type OgFontWeight = 400 | 500 | 600 | 700;

export interface OgFontRequest {
  family: OgFontFamily;
  weight: OgFontWeight;
  text: string;
}

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: OgFontWeight;
  style: 'normal';
}

const fontFileUrlPattern = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/;

function uniqueGlyphs(text: string): string {
  return Array.from(new Set(Array.from(text))).join('');
}

export async function loadGoogleFont({
  family,
  weight,
  text,
}: OgFontRequest): Promise<OgFont | null> {
  try {
    const query = new URLSearchParams({
      family: `${family}:wght@${weight}`,
      text: uniqueGlyphs(text),
    });
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query.toString()}`)).text();
    const fontUrl = fontFileUrlPattern.exec(css)?.[1];
    if (!fontUrl) return null;

    const response = await fetch(fontUrl);
    if (!response.ok) return null;

    return { name: family, data: await response.arrayBuffer(), weight, style: 'normal' };
  } catch {
    return null;
  }
}

export async function loadOgFonts(requests: OgFontRequest[]): Promise<OgFont[]> {
  const fonts = await Promise.all(requests.map(loadGoogleFont));
  return fonts.filter((font): font is OgFont => font !== null);
}
