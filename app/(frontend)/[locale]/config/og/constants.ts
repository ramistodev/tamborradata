export const ogSize = { width: 1200, height: 630 } as const;

export const ogContentType = 'image/png';

export const ogColors = {
  background: '#060912',
  backgroundSecondary: '#0b101c',
  card: '#0a1020',
  accent: '#4d8cff',
  accentDim: '#2c6cd9',
  accentGlow: 'rgba(77,140,255,0.12)',
  text: '#e8edf7',
  textSecondary: '#8d9bb8',
  textTertiary: '#7a8aa8',
  border: '#1a2236',
} as const;

export const ogFontFamily = {
  title: 'Sora',
  body: 'Space Grotesk',
  mono: 'JetBrains Mono',
} as const;

export type OgFontFamily = (typeof ogFontFamily)[keyof typeof ogFontFamily];

export const ogSafeMargin = 72;
