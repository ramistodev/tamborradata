import { test, expect, type Locator } from '@playwright/test';
import { discoverPeriods, pickGlobal, pickYear } from '../support/api';
import { blockVercelScripts, collectConsoleErrors } from '../support/console';

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

type JsonLdNode = { '@type'?: string | string[] };

test.describe('landing page', () => {
  test('renders the title, the hero, the stats, the links and the structured data', async ({
    page,
    request,
  }) => {
    await blockVercelScripts(page);
    const errors = collectConsoleErrors(page);
    const periods = await discoverPeriods(request);
    const global = pickGlobal(periods);
    const newest = pickYear(periods);

    await page.goto('/');

    // Landing.metadata.title / siteName
    await expect(page).toHaveTitle('Tamborradata');
    await expect(page.getByRole('heading', { level: 1, name: 'Tamborradata' })).toBeVisible();

    // Landing.hero.metrics
    for (const label of ['Participaciones', 'Ediciones', 'Colegios']) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }

    // The two stats cards: the global one and the last edition. Their figures count up from 0
    const globalCard = page
      .locator('article')
      .filter({ has: page.getByRole('link', { name: 'Ver historia completa' }) });
    const lastCard = page
      .locator('article')
      .filter({ has: page.getByRole('link', { name: /^Ver edición \d{4}$/ }) });
    await globalCard.scrollIntoViewIfNeeded();
    for (const card of [globalCard, lastCard]) {
      await expect(card.locator('span.font-title').first()).toHaveText(/^[1-9][\d.,]*$/, {
        timeout: 5_000,
      });
    }

    // Landing.searchParticipants.cta / Landing.stats.global.cta / Landing.stats.last.cta
    await expect(page.getByRole('link', { name: 'Ir al buscador' })).toHaveAttribute(
      'href',
      '/search-participants'
    );
    if (global) {
      await expect(page.getByRole('link', { name: 'Ver historia completa' })).toHaveAttribute(
        'href',
        `/statistics/${global.publicSlug}`
      );
    }
    if (newest) {
      await expect(
        page.getByRole('link', { name: `Ver edición ${newest.publicSlug}`, exact: true })
      ).toHaveAttribute('href', `/statistics/${newest.publicSlug}`);
    }

    // Structured data: every block parses, the site entities are declared
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(scripts.length).toBeGreaterThan(0);
    const nodes = scripts.flatMap((text) => {
      const data = JSON.parse(text) as JsonLdNode & { '@graph'?: JsonLdNode[] };
      return data['@graph'] ?? [data];
    });
    const types = nodes.flatMap((node) => node['@type'] ?? []);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');

    expect(errors).toEqual([]);
  });

  test('the first FAQ question toggles its answer', async ({ page }) => {
    await page.goto('/');

    // Landing.faq.items.what.question
    const question = page.getByRole('button', { name: '¿Qué es Tamborradata?' });
    await question.scrollIntoViewIfNeeded();
    await waitForHydration(question);
    await expect(question).toHaveAttribute('aria-expanded', 'false');

    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'true');

    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'false');
  });

  test('the press link opens the article in a new tab', async ({ page }) => {
    await page.goto('/');

    // Landing.press.openArticle
    const link = page.getByRole('link', { name: /Abrir el artículo original/ });

    await expect(link).toHaveAttribute('href', /^https:\/\/www\.diariovasco\.com\//);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  });
});
