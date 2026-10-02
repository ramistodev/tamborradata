export const locale = {
  en: 'en',
  es: 'es',
  eu: 'eu',
} as const;

export type Locale = (typeof locale)[keyof typeof locale];
