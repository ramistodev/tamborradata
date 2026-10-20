import { test, expect, type Locator, type Page } from '@playwright/test';
import { discoverPeriods, pickYear } from '../support/api';

const SITE_URL = 'https://tamborradata.com';

/** Interactive elements only work once React hydrated them; a click before that is lost. */
async function waitForHydration(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith('__reactProps$'))
      )
    )
    .toBe(true);
}

/** Path, query and hash of the current URL. */
function location(page: Page): string {
  const { pathname, search, hash } = new URL(page.url());

  return `${pathname}${search}${hash}`;
}

test.describe('locale in the document', () => {
  for (const [path, lang, ogLocale] of [
    ['/', 'es', 'es_ES'],
    ['/en', 'en', 'en_US'],
    ['/eu', 'eu', 'eu_ES'],
  ] as const) {
    test(`${path} is ${lang} with og:locale ${ogLocale}`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        ogLocale
      );
    });
  }

  test('/es redirects to the unprefixed default locale', async ({ page }) => {
    await page.goto('/es');

    await page.waitForURL((url) => url.pathname === '/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test.describe('language switcher', () => {
  test('keeps the path, the query and the hash when changing language', async ({
    page,
    request,
  }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');
    const rest = `/statistics/${year!.publicSlug}?x=1#sec`;

    await page.goto(rest);
    // Header.language is "Idioma" only in Spanish; the button names are the same in every language
    const switcher = page.getByRole('group', { name: 'Idioma' });
    await waitForHydration(switcher.getByRole('button').first());

    await page.getByRole('button', { name: 'EN, English' }).click();
    await expect.poll(() => location(page)).toBe(`/en${rest}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.getByRole('button', { name: 'ES, Español' }).click();
    await expect.poll(() => location(page)).toBe(rest);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await page.getByRole('button', { name: 'EU, Euskara' }).click();
    await expect.poll(() => location(page)).toBe(`/eu${rest}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'eu');
  });
});

test.describe('alternate and canonical links', () => {
  test('the landing declares all the alternates and its canonical', async ({ page }) => {
    await page.goto('/');

    for (const [hreflang, href] of [
      ['en', `${SITE_URL}/en`],
      ['es', SITE_URL],
      ['eu', `${SITE_URL}/eu`],
      ['x-default', SITE_URL],
    ]) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        hreflang
      ).toHaveAttribute('href', href);
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', SITE_URL);
  });

  test('a localized page canonicalizes to its own locale', async ({ page }) => {
    await page.goto('/en/search-participants');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_URL}/en/search-participants`
    );
  });
});
