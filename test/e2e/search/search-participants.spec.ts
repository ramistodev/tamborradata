import { test, expect, type Page, type Route } from '@playwright/test';
import { collectConsoleErrors, blockVercelScripts } from '../support/console';
import { uniqueIp } from '../support/ip';

const SEARCH_PATH = '/search-participants';
const PARTICIPANT_NAME = 'Ane Garcia Lopez';

// Search.form.ariaLabel
const FORM_NAME = 'Buscador de participantes';
// Search.status.prompt.title
const PROMPT_TITLE = 'Introduce nombre, apellidos y colegio';

function searchForm(page: Page) {
  return page.getByRole('search', { name: FORM_NAME });
}

// Search.form.name.ariaLabel
function nameTextbox(page: Page) {
  return searchForm(page).getByRole('textbox', { name: 'Nombre y dos apellidos' });
}

// Search.form.school.ariaLabel (scoped to the form: the FAQ buttons also mention "colegio")
function schoolTrigger(page: Page) {
  return searchForm(page).getByRole('button', { name: 'Colegio' });
}

// Search.form.submit
function submitButton(page: Page) {
  return searchForm(page).getByRole('button', { name: 'Buscar', exact: true });
}

/** Opens the school popup, picks the first option and returns its text. */
async function chooseFirstSchool(page: Page): Promise<string> {
  const trigger = schoolTrigger(page);
  const option = page.getByRole('option').first();

  // The first clicks can land before hydration and be lost, so retry until the popup is open
  await expect(async () => {
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
    await expect(option).toBeVisible({ timeout: 1_000 });
  }).toPass();

  const school = (await option.innerText()).trim();
  await option.click();

  return school;
}

async function mockParticipants(page: Page, handler: (route: Route) => Promise<void> | void) {
  await page.route('**/api/participants', handler);
}

function successBody(school: string): string {
  return JSON.stringify([
    {
      matchType: 'exact',
      name: PARTICIPANT_NAME,
      nameKey: 'ane garcia lopez',
      school: { canonicalName: school, schoolKey: 'k' },
      participations: [
        { url: 'https://example.org/2024', year: 2024 },
        { url: null, year: 2023 },
      ],
    },
  ]);
}

function fulfillSuccess(route: Route, school: string) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: successBody(school) });
}

test.describe('search participants page', () => {
  test('loads the heading, the search form and the prompt', async ({ page }) => {
    await page.goto(SEARCH_PATH);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(searchForm(page)).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: PROMPT_TITLE })).toBeVisible();
  });

  test('does not call the API when the name has fewer than three words', async ({ page }) => {
    const apiRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/participants')) apiRequests.push(request.url());
    });
    await page.goto(SEARCH_PATH);

    await chooseFirstSchool(page);
    await nameTextbox(page).fill('Ane Maria');
    // The button is aria-disabled (not disabled): a user can still click it and the form answers by
    // focusing the name field. Playwright's actionability check treats aria-disabled as not enabled.
    await expect(submitButton(page)).toHaveAttribute('aria-disabled', 'true');
    await submitButton(page).click({ force: true });

    await expect(nameTextbox(page)).toBeFocused();
    expect(apiRequests).toEqual([]);
    await expect(page.getByRole('heading', { level: 3, name: PROMPT_TITLE })).toBeVisible();
  });

  test('shows the result card and clears the search (mocked success)', async ({ page }) => {
    let school = '';
    await mockParticipants(page, (route) => fulfillSuccess(route, school));
    await page.goto(SEARCH_PATH);

    school = await chooseFirstSchool(page);
    await nameTextbox(page).fill(PARTICIPANT_NAME);
    await submitButton(page).click();

    await expect(page.getByRole('heading', { level: 3, name: PARTICIPANT_NAME })).toBeVisible();
    // Search.results.card.exact
    await expect(page.getByText('Coincidencia exacta', { exact: true })).toBeVisible();
    // Search.results.row.viewSourceAriaLabel
    const sourceLink = page.getByRole('link', { name: /Ver fuente de 2024 en example\.org/ });
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute('href', 'https://example.org/2024');
    // Search.results.row.noSource
    await expect(page.getByText('Sin fuente', { exact: true })).toBeVisible();

    // Search.results.summary.clear
    await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();

    await expect(page.getByRole('heading', { level: 3, name: PROMPT_TITLE })).toBeVisible();
    await expect(nameTextbox(page)).toHaveValue('');
  });

  test('shows the empty-result panel (mocked empty list)', async ({ page }) => {
    await mockParticipants(page, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.goto(SEARCH_PATH);

    await chooseFirstSchool(page);
    await nameTextbox(page).fill(PARTICIPANT_NAME);
    await submitButton(page).click();

    // Search.status.noResults.title
    await expect(
      page.getByRole('heading', { level: 3, name: 'No hemos encontrado coincidencias' })
    ).toBeVisible();
  });

  test('shows the error panel and recovers on retry (mocked 500 then success)', async ({
    page,
  }) => {
    let school = '';
    let calls = 0;
    await mockParticipants(page, (route) => {
      calls += 1;
      if (calls === 1) {
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: '{"error":"boom"}',
        });
      }
      return fulfillSuccess(route, school);
    });
    await page.goto(SEARCH_PATH);

    school = await chooseFirstSchool(page);
    await nameTextbox(page).fill(PARTICIPANT_NAME);
    await submitButton(page).click();

    // Search.status.error.title / Search.status.error.retry
    await expect(
      page.getByRole('heading', { level: 3, name: 'No se ha podido completar la búsqueda' })
    ).toBeVisible();
    const retry = page.getByRole('button', { name: 'Reintentar' });
    await expect(retry).toBeVisible();

    await retry.click();

    await expect(page.getByRole('heading', { level: 3, name: PARTICIPANT_NAME })).toBeVisible();
  });

  test('shows the rate-limit panel with a disabled retry button (mocked 429)', async ({ page }) => {
    await mockParticipants(page, (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'retry-after': '120' },
        body: '{"error":"Too many requests"}',
      })
    );
    await page.goto(SEARCH_PATH);

    await chooseFirstSchool(page);
    await nameTextbox(page).fill(PARTICIPANT_NAME);
    await submitButton(page).click();

    // Search.status.rateLimited.title
    await expect(
      page.getByRole('heading', { level: 3, name: 'Demasiadas búsquedas seguidas' })
    ).toBeVisible();
    // Search.status.rateLimited.countdown ("... en 2 min 0 s"); the sr-only announcer uses another sentence
    await expect(page.getByText(/Podrás volver a buscar en (2|1) min/)).toBeVisible();
    // Search.status.rateLimited.retry
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeDisabled();
  });

  test('runs a real search without console errors', async ({ page }) => {
    await blockVercelScripts(page);
    const errors = collectConsoleErrors(page);
    // A unique address, so the rate limiter never sees the same client twice
    await page.route('**/api/participants', (route) =>
      route.continue({
        headers: { ...route.request().headers(), 'x-forwarded-for': uniqueIp() },
      })
    );
    await page.goto(SEARCH_PATH);

    await chooseFirstSchool(page);
    await nameTextbox(page).fill(PARTICIPANT_NAME);
    await submitButton(page).click();

    // Either a result card or the empty-result panel: both are level-3 headings inside the results region
    // (Search.results.title). The prompt is also an h3, so the next assertion makes sure it was replaced.
    const results = page.getByRole('region', { name: 'Resultados de la búsqueda' });
    await expect(results.getByRole('heading', { level: 3 }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(results.getByRole('heading', { level: 3, name: PROMPT_TITLE })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
