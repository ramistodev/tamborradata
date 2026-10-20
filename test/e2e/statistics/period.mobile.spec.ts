import { test, expect } from '@playwright/test';
import { discoverPeriods, pickGlobal, pickYear } from '../support/api';

// Statistics.chapters.ariaLabel
const CHAPTERS_NAV = 'Explorar datos';
// Statistics.layout.legendLabel
const LEGEND_LABEL = 'Series del gráfico: pulsa para mostrar u ocultar';

test.describe('statistics pages on a phone', () => {
  test('the year page does not overflow horizontally', async ({ page, request }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('the chapter navigation scrolls on its own without widening the page', async ({
    page,
    request,
  }) => {
    const year = pickYear(await discoverPeriods(request));
    test.skip(!year, 'no published year period in the live data');

    await page.goto(`/statistics/${year!.publicSlug}`);
    const list = page.getByRole('navigation', { name: CHAPTERS_NAV }).getByRole('list');
    await expect(list).toBeVisible();

    const metrics = await list.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(metrics.clientWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);

    await list.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });

    await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('the series chart legend chips show the latest values on the global page', async ({
    page,
    request,
  }) => {
    const global = pickGlobal(await discoverPeriods(request));
    test.skip(!global, 'no published global period in the live data');

    await page.goto(`/statistics/${global!.publicSlug}`);

    const legend = page.getByRole('list', { name: LEGEND_LABEL }).first();
    await expect(legend).toBeVisible();
    await expect(legend.getByRole('button').filter({ hasText: /\d/ }).first()).toBeVisible();
  });
});
