import { beforeEach, describe, expect, it, vi } from 'vitest';

const permanentRedirect = vi.hoisted(() =>
  vi.fn((args: { href: string; locale: string }) => {
    throw new Error(`REDIRECT:${args.locale}:${args.href}`);
  })
);
const notFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('NOT_FOUND');
  })
);

vi.mock('@/app/(frontend)/i18n/navigation', () => ({ permanentRedirect }));
vi.mock('next/navigation', () => ({ notFound }));

import { resolveArticle } from '@/app/(frontend)/[locale]/(pages)/articles/data/resolveArticle';
import { getArticleSlugs } from '@/app/(frontend)/[locale]/(pages)/articles/data/getArticles';

const retired = {
  es: 'unai-garcia-lo-que-nuestros-nombres-y-apellidos-cuentan-sobre-donostia',
  en: 'unai-garcia-what-our-first-names-and-surnames-say-about-donostia',
  eu: 'unai-garcia-gure-izen-abizenek-donostiari-buruz-zer-kontatzen-duten',
} as const;

const replacement = {
  es: 'donostia-cambia-de-nombres-pero-conserva-sus-apellidos',
  en: 'donostia-changes-its-names-but-keeps-its-surnames',
  eu: 'donostiak-izenak-aldatzen-ditu-baina-abizenak-gordetzen-ditu',
} as const;

describe('resolveArticle: retired Unai García article', () => {
  beforeEach(() => {
    permanentRedirect.mockClear();
    notFound.mockClear();
  });

  it.each(['es', 'en', 'eu'] as const)(
    'permanently redirects the %s slug to the replacement article in the same locale',
    (locale) => {
      expect(() => resolveArticle(locale, retired[locale])).toThrow(
        `REDIRECT:${locale}:/articles/${replacement[locale]}`
      );
    }
  );

  it.each([
    ['en', 'es'],
    ['eu', 'en'],
    ['es', 'eu'],
  ] as const)('redirects a %s-locale visit using the %s slug to the %s-locale replacement', (visitLocale, slugLocale) => {
    expect(() => resolveArticle(visitLocale, retired[slugLocale])).toThrow(
      `REDIRECT:${visitLocale}:/articles/${replacement[visitLocale]}`
    );
  });

  it('no longer lists the retired article', () => {
    for (const locale of ['es', 'en', 'eu'] as const) {
      expect(getArticleSlugs(locale)).not.toContain(retired[locale]);
      expect(getArticleSlugs(locale)).toContain(replacement[locale]);
    }
  });

  it('still returns 404 for an unknown slug', () => {
    expect(() => resolveArticle('es', 'no-existe')).toThrow('NOT_FOUND');
    expect(permanentRedirect).not.toHaveBeenCalled();
  });
});
