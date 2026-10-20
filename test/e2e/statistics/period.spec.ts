import {
  test,
  expect,
  type APIRequestContext,
  type Locator,
  type Page,
} from '@playwright/test';
import { discoverPeriods, pickGlobal, pickYear } from '../support/api';
import { blockVercelScripts, collectConsoleErrors } from '../support/console';

const SITE_URL = 'https://tamborradata.com';
// Rank pages hold 10 rows (RANK_PAGE_SIZE in the app)
const RANK_PAGE_SIZE = 10;
// A ranking page is a request to the live database, which can take several seconds on a cold start
const PAGE_LOAD_TIMEOUT_MS = 30_000;

// Statistics.chapters.ariaLabel
const CHAPTERS_NAV = 'Explorar datos';
// Statistics.periodSelector.label
const PERIODS_NAV = 'Periodos';
// Statistics.layout.showMore / showLess / loadError / retry
const SHOW_MORE = /Mostrar más/;
const SHOW_LESS = /Mostrar menos/;
const LOAD_ERROR = 'No se han podido cargar más resultados.';
const RETRY = 'Reintentar';

async function targets(request: APIRequestContext) {
  const periods = await discoverPeriods(request);

  return { periods, year: pickYear(periods), global: pickGlobal(periods) };
}

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

/** Marks the `<ol>` that belongs to a "show more" button and returns a stable locator for its rows. */
async function tagRankRows(page: Page, button: Locator): Promise<Locator> {
  await button.evaluate((element) => {
    // button > buttons wrapper > ranking container, which also holds the <ol>
    const container = element.parentElement?.parentElement;
    container?.querySelector(':scope > ol')?.setAttribute('data-e2e-rank', 'true');
  });

  return page.locator('[data-e2e-rank="true"] > li');
}

test.describe('year statistics page', () => {
  test('exposes the title, description, canonical, heading and publish date', async ({
    page,
    request,
  }) => {
    const { year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);

    await expect(page).toHaveTitle(new RegExp(year!.publicSlug));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_URL}/statistics/${year!.publicSlug}`
    );
    await expect(page.getByRole('heading', { level: 1 })).toContainText(year!.publicSlug);
    // Statistics.publishDates.published / updated
    await expect(page.locator('time', { hasText: /^(Publicado|Actualizado) el/ })).toBeVisible();
  });

  test('chapter navigation lists the chapters and follows the clicked one', async ({
    page,
    request,
  }) => {
    const { year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    const links = page.getByRole('navigation', { name: CHAPTERS_NAV }).getByRole('link');

    // Statistics.chapters.hero / closing
    await expect(links.first()).toHaveText('Resumen');
    await expect(links.last()).toHaveText('Cierre');
    await expect(links.first()).toHaveAttribute('aria-current', 'location');

    const second = links.nth(1);
    const href = await second.getAttribute('href');
    expect(href).toMatch(/^#.+/);
    await waitForHydration(second);
    await second.click();

    await expect.poll(() => page.url()).toMatch(new RegExp(`${href}$`));
    await expect(page.locator(href!)).toBeInViewport();
    await expect(second).toHaveAttribute('aria-current', 'location');
  });

  test('period selector marks the current period and navigates to another one', async ({
    page,
    request,
  }) => {
    const { periods, year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');
    const other = periods.find((period) => period.publicSlug !== year!.publicSlug);
    test.skip(!other, 'only one published period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    const selector = page.getByRole('navigation', { name: PERIODS_NAV });
    const heading = page.getByRole('heading', { level: 1 });

    await expect(
      selector.getByRole('link', { name: year!.publicSlug, exact: true })
    ).toHaveAttribute('aria-current', 'page');

    const headingBefore = await heading.textContent();
    const otherLink = selector.getByRole('link', { name: other!.publicSlug, exact: true });
    await waitForHydration(otherLink);
    await otherLink.click();

    await page.waitForURL(`**/statistics/${other!.publicSlug}`);
    await expect(heading).not.toHaveText(headingBefore ?? '');
  });

  test('a ranking loads more rows and collapses back', async ({ page, request }) => {
    const { year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    const showMore = page.getByRole('button', { name: SHOW_MORE }).first();
    test.skip(
      (await page.getByRole('button', { name: SHOW_MORE }).count()) === 0,
      'no ranking with a second page in the live data'
    );

    // Hydrate first: the marker attribute is added from outside React and a re-render would drop it
    await waitForHydration(showMore);
    const rows = await tagRankRows(page, showMore);
    const initial = await rows.count();
    await showMore.click();

    // The skeleton rows shown while the next page loads are <li> of the same <ol>, so the row count
    // grows before any real row arrives. "Show less" only appears once the page is in.
    const showLess = page.getByRole('button', { name: SHOW_LESS }).first();
    await expect(showLess).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT_MS });
    const loaded = await rows.count();
    expect(loaded).toBeGreaterThan(initial);
    expect(loaded).toBeLessThanOrEqual(initial + RANK_PAGE_SIZE);

    await showLess.click();

    await expect.poll(() => rows.count()).toBe(initial);
  });

  test('a failed ranking page shows an alert and recovers on retry', async ({ page, request }) => {
    const { year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    const showMore = page.getByRole('button', { name: SHOW_MORE }).first();
    test.skip(
      (await page.getByRole('button', { name: SHOW_MORE }).count()) === 0,
      'no ranking with a second page in the live data'
    );

    const rows = await tagRankRows(page, showMore);
    const initial = await rows.count();
    const categoriesGlob = '**/api/statistics/*/categories/**';
    await page.route(categoriesGlob, (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
    );
    await waitForHydration(showMore);
    await showMore.click();

    const alert = page.getByRole('alert').filter({ hasText: LOAD_ERROR });
    await expect(alert).toBeVisible();
    expect(await rows.count()).toBe(initial);

    await page.unroute(categoriesGlob);
    await alert.getByRole('button', { name: RETRY }).click();

    await expect.poll(() => rows.count()).toBeGreaterThan(initial);
    await expect(alert).toHaveCount(0);
  });

  test('back to top scrolls the page to the start', async ({ page, request }) => {
    const { year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    // Statistics.closing.backToTop
    const backToTop = page.getByRole('button', { name: 'Volver arriba' });
    await waitForHydration(backToTop);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(backToTop).toBeInViewport();

    await backToTop.click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('embeds a WebPage, BreadcrumbList and Dataset graph for the year', async ({
    page,
    request,
  }) => {
    const { year } = await targets(request);
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const graphs = scripts
      .map((text) => JSON.parse(text) as { '@graph'?: Array<Record<string, unknown>> })
      .filter((data) => Array.isArray(data['@graph']));
    const nodes = graphs.flatMap((data) => data['@graph'] ?? []);
    const url = `${SITE_URL}/statistics/${year!.publicSlug}`;

    for (const type of ['WebPage', 'BreadcrumbList', 'Dataset']) {
      expect(nodes.some((node) => node['@type'] === type)).toBe(true);
    }
    for (const type of ['WebPage', 'Dataset']) {
      expect(nodes.find((node) => node['@type'] === type)?.url).toBe(url);
    }
    // The last breadcrumb item points to the page itself
    const breadcrumb = nodes.find((node) => node['@type'] === 'BreadcrumbList') as {
      itemListElement: Array<{ item: string }>;
    };
    expect(breadcrumb.itemListElement.at(-1)?.item).toBe(url);
  });
});

test.describe('global statistics page', () => {
  test('shows the history heading and an interactive series chart', async ({ page, request }) => {
    const { global } = await targets(request);
    test.skip(!global, 'no published global period in the live data');

    await page.goto(`/statistics/${global!.publicSlug}`);

    // Statistics.period.globalTitle (document title) and Statistics.hero.titleGlobal (compact heading)
    await expect(page).toHaveTitle(/Estadísticas históricas/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Historia completa');
    expect(await page.locator('figure svg path.series-draw').count()).toBeGreaterThan(0);

    const chart = page
      .getByRole('group')
      .filter({ has: page.locator('svg path.series-draw') })
      .first();
    await waitForHydration(chart);
    await expect(async () => {
      await chart.hover({ position: { x: 200, y: 100 } });
      await expect(chart.getByRole('status')).toHaveText(/\S/, { timeout: 1_000 });
    }).toPass();
  });
});

test.describe('statistics pages console', () => {
  test('load and scroll without console errors', async ({ page, request }) => {
    const { year, global } = await targets(request);
    test.skip(!year && !global, 'no published period in the live data');
    await blockVercelScripts(page);
    const errors = collectConsoleErrors(page);

    for (const period of [year, global]) {
      if (!period) continue;
      await page.goto(`/statistics/${period.publicSlug}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(page.getByRole('button', { name: 'Volver arriba' })).toBeInViewport();
    }

    expect(errors).toEqual([]);
  });
});
