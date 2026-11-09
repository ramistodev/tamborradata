import { describe, expect, it } from 'vitest';
import { translatePathname } from '@/app/(frontend)/i18n/translatePathname';

describe('translatePathname', () => {
  it('translates an article slug between locales', () => {
    expect(
      translatePathname('/articles/cada-vez-es-mas-dificil-llamarse-como-los-demas', 'es', 'en')
    ).toBe('/articles/it-is-getting-harder-to-share-a-name-with-anyone-else');
    expect(
      translatePathname('/articles/donostia-changes-its-names-but-keeps-its-surnames', 'en', 'eu')
    ).toBe('/articles/donostiak-izenak-aldatzen-ditu-baina-abizenak-gordetzen-ditu');
  });

  it.each([
    '/articles',
    '/articles/unknown-slug',
    '/articles/cada-vez-es-mas-dificil-llamarse-como-los-demas/extra',
    '/statistics/2024',
    '/',
  ])('leaves %s unchanged', (pathname) => {
    expect(translatePathname(pathname, 'es', 'en')).toBe(pathname);
  });

  it('leaves a slug of another locale unchanged', () => {
    const pathname = '/articles/cada-vez-es-mas-dificil-llamarse-como-los-demas';
    expect(translatePathname(pathname, 'en', 'eu')).toBe(pathname);
  });
});
