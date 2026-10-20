import { test, expect, type Locator } from '@playwright/test';
import { discoverPeriods, pickYear } from '../support/api';

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

// Header.openMenu / Header.closeMenu / Header.menuLabel / Header.statistics / Header.statisticsOptions
// / Header.language
const OPEN_MENU = 'Abrir menú de navegación';
const CLOSE_MENU = 'Cerrar menú de navegación';
const MENU_LABEL = 'Menú de navegación';
const STATISTICS = 'Estadísticas';
const STATISTICS_LIST = 'Opciones de estadísticas';
const LANGUAGE = 'Idioma';

test.describe('mobile navigation menu', () => {
  test('shows the burger button instead of the desktop statistics menu', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: OPEN_MENU })).toBeVisible();
    await expect(page.getByRole('button', { name: STATISTICS, exact: true })).not.toBeVisible();
  });

  test('opens the dialog and closes it with the close button', async ({ page }) => {
    await page.goto('/');
    const burger = page.getByRole('button', { name: OPEN_MENU });
    const dialog = page.getByRole('dialog', { name: MENU_LABEL });
    await waitForHydration(burger);

    await burger.click();

    await expect(dialog).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    // The language switcher lives inside the dialog on a phone
    await expect(dialog.getByRole('group', { name: LANGUAGE })).toBeVisible();

    await dialog.getByRole('button', { name: CLOSE_MENU }).click();

    await expect(dialog).not.toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  test('the statistics accordion lists the periods and a link closes the menu', async ({
    page,
    request,
  }) => {
    const periods = await discoverPeriods(request);
    const newest = pickYear(periods);
    test.skip(!newest, 'no published year period in the live data');

    await page.goto('/');
    const burger = page.getByRole('button', { name: OPEN_MENU });
    const dialog = page.getByRole('dialog', { name: MENU_LABEL });
    await waitForHydration(burger);
    await burger.click();
    await expect(dialog).toBeVisible();

    const accordion = dialog.getByRole('button', { name: STATISTICS, exact: true });
    await expect(accordion).toHaveAttribute('aria-expanded', 'false');
    await accordion.click();

    await expect(accordion).toHaveAttribute('aria-expanded', 'true');
    const list = dialog.getByRole('list', { name: STATISTICS_LIST });
    await expect(list.getByRole('link')).toHaveCount(periods.length);

    await list.getByRole('link', { name: newest!.publicSlug, exact: true }).click();

    await page.waitForURL(`**/statistics/${newest!.publicSlug}`);
    await expect(dialog).not.toBeVisible();
  });
});
