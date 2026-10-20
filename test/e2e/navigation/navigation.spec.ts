import { test, expect, type Locator } from '@playwright/test';
import { discoverPeriods, pickGlobal, pickYear } from '../support/api';
import { isProductionTarget } from '../support/server';

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

// Header.statistics / Header.statisticsOptions / Header.search
const STATISTICS_BUTTON = 'Estadísticas';
const STATISTICS_LIST = 'Opciones de estadísticas';

// NotFound.title / NotFound.backHome in English (app/(frontend)/i18n/translations/en/notFound.ts)
const NOT_FOUND_TITLE_EN = 'This page is outside of the universe';

test.describe('header statistics menu', () => {
  test('opens by keyboard, lists the periods with the global one first and navigates', async ({
    page,
    request,
  }) => {
    const periods = await discoverPeriods(request);
    const global = pickGlobal(periods);
    const newest = pickYear(periods);
    test.skip(!newest, 'no published year period in the live data');

    await page.goto('/');
    const button = page.getByRole('button', { name: STATISTICS_BUTTON, exact: true });
    await waitForHydration(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    // Keyboard opening: a mouse click first hovers, and the hover already opens the menu
    await button.focus();
    await page.keyboard.press('Enter');

    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const list = page.getByRole('list', { name: STATISTICS_LIST });
    const slugs = await list.getByRole('link').allTextContents();
    expect([...slugs].sort()).toEqual(periods.map((period) => period.publicSlug).sort());
    if (global) expect(slugs[0]).toBe(global.publicSlug);

    await list.getByRole('link', { name: newest!.publicSlug, exact: true }).click();

    await page.waitForURL(`**/statistics/${newest!.publicSlug}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('hovering the statistics button opens the menu and a click on it closes it', async ({
    page,
    request,
  }) => {
    const periods = await discoverPeriods(request);
    test.skip(periods.length === 0, 'no published period in the live data');

    await page.goto('/');
    const button = page.getByRole('button', { name: STATISTICS_BUTTON, exact: true });
    await waitForHydration(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    await button.hover();

    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('list', { name: STATISTICS_LIST })).toBeVisible();

    // The click toggles: the menu opened by the hover is closed by it
    await button.click();

    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the search link goes to the participants search', async ({ page }) => {
    await page.goto('/');

    // Header.search
    await page.getByRole('link', { name: 'Buscar participante' }).click();

    await page.waitForURL('**/search-participants');
  });
});

test.describe('accessibility and footer', () => {
  test('the skip link is the first tab stop and moves the focus to the main content', async ({
    page,
  }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    // Header.skipToContent
    const skipLink = page.getByRole('link', { name: 'Saltar al contenido' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(page.locator('main#main-content')).toBeFocused();
  });

  test('the footer links to the privacy policy, GitHub and the coffee page', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');

    // Footer.policyPrivacy / Footer.openSource
    await expect(footer.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute(
      'href',
      '/privacy-policy'
    );
    const github = footer.getByRole('link', { name: /Código abierto en GitHub/ });
    await expect(github).toHaveAttribute('href', 'https://github.com/ramistodev/tamborradata');
    await expect(github).toHaveAttribute('target', '_blank');
    await expect(footer.locator('a[href="https://buymeacoffee.com/tamborradata"]')).toHaveCount(1);
  });
});

test.describe('not found page', () => {
  test('answers 404 to an HTML request', async ({ request }) => {
    const response = await request.get('/no-such-page', { headers: { accept: 'text/html' } });

    expect(response.status()).toBe(404);
  });

  test('shows the Spanish message and a link home', async ({ page }) => {
    await page.goto('/no-such-page');

    // NotFound.title / NotFound.backHome
    await expect(page.getByText('Esta página está fuera del universo')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ir a la página de inicio' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  test('shows the English message under /en', async ({ page }) => {
    await page.goto('/en/no-such-page');

    await expect(page.getByText(NOT_FOUND_TITLE_EN)).toBeVisible();
  });
});

test.describe('redirects', () => {
  const noFollow = { maxRedirects: 0 } as const;

  test.describe('legacy search path', () => {
    for (const [from, to] of [
      ['/search', '/search-participants'],
      ['/en/search', '/en/search-participants'],
      ['/eu/search', '/eu/search-participants'],
    ]) {
      test(`${from} permanently redirects to ${to}`, async ({ request }) => {
        const response = await request.get(from, noFollow);

        expect(response.status()).toBe(308);
        expect(response.headers()['location']).toMatch(new RegExp(`${to}$`));
      });
    }
  });

  test('/statistics redirects to the global period', async ({ page, request }) => {
    const global = pickGlobal(await discoverPeriods(request));
    test.skip(!global, 'no published global period in the live data');

    const response = await request.get('/statistics', noFollow);

    expect([307, 308]).toContain(response.status());
    expect(response.headers()['location']).toMatch(
      new RegExp(`/statistics/${global!.publicSlug}$`)
    );

    await page.goto('/statistics');
    await expect(page).toHaveURL(new RegExp(`/statistics/${global!.publicSlug}$`));
  });

  test('the www host redirects to the bare domain', async ({ request }) => {
    test.skip(!isProductionTarget(), 'requires a production build');

    const response = await request.get('/', {
      headers: { host: 'www.tamborradata.com' },
      ...noFollow,
    });

    expect(response.status()).toBe(308);
    // Next emits the root target without the trailing slash; both spell the same URL
    expect(new URL(response.headers()['location']).href).toBe('https://tamborradata.com/');
  });
});
