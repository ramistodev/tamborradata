import { describe, expect, it } from 'vitest';
import { translatePathname } from '@/app/(frontend)/i18n/translatePathname';

describe('translatePathname', () => {
  it('translates an article slug between locales', () => {
    expect(
      translatePathname('/articles/cada-vez-es-mas-dificil-llamarse-como-los-demas', 'es', 'en')
    ).toBe('/articles/it-is-getting-harder-to-share-a-name-with-anyone-else');
    expect(
      translatePathname(
        '/articles/unai-garcia-what-our-first-names-and-surnames-say-about-donostia',
        'en',
        'eu'
      )
    ).toBe('/articles/unai-garcia-gure-izen-abizenek-donostiari-buruz-zer-kontatzen-duten');
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
