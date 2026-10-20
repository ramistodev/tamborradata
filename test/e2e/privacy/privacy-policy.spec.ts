import { test, expect } from '@playwright/test';

const SITE_URL = 'https://tamborradata.com';

// Titles and heading lines come from PrivacyPolicy.metadata.title and PrivacyPolicy.hero.titleLine1 / titleLine2
const LOCALES = [
  {
    path: '/privacy-policy',
    title: 'Política de privacidad | Tamborradata',
    heading: ['Política de', 'privacidad'],
  },
  {
    path: '/en/privacy-policy',
    title: 'Privacy policy | Tamborradata',
    heading: ['Privacy', 'policy'],
  },
  {
    path: '/eu/privacy-policy',
    title: 'Pribatutasun-politika | Tamborradata',
    heading: ['Pribatutasun-', 'politika'],
  },
] as const;

test.describe('privacy policy page', () => {
  for (const { path, title, heading } of LOCALES) {
    test(`${path} has its localized title and heading`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(title);
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toContainText(heading[0]);
      await expect(h1).toContainText(heading[1]);
    });
  }

  test('lists the twelve sections with the first and last titles', async ({ page }) => {
    await page.goto('/privacy-policy');
    const sections = page.getByRole('main').getByRole('heading', { level: 2 });

    await expect(sections).toHaveCount(12);
    // PrivacyPolicy.sections.controller.title / PrivacyPolicy.sections.changes.title
    await expect(sections.first()).toHaveText('Responsable y contacto');
    await expect(sections.last()).toHaveText('Cambios en esta política');
  });

  test('the contents navigation jumps to a section and marks it', async ({ page }) => {
    await page.goto('/privacy-policy');
    // PrivacyPolicy.aside.title
    const contents = page.getByRole('navigation', { name: 'Contenido' });

    await expect(contents.getByRole('link')).toHaveCount(12);

    // PrivacyPolicy.sections.cookies.title
    const link = contents.getByRole('link', { name: /Cookies y analítica/ });
    await link.click();

    await expect.poll(() => new URL(page.url()).hash).toBe('#cookies');
    await expect(page.locator('section#cookies')).toBeInViewport();
    await expect(link).toHaveAttribute('aria-current', 'location');
  });

  test('declares its canonical URL and valid structured data', async ({ page }) => {
    await page.goto('/privacy-policy');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_URL}/privacy-policy`
    );
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(scripts.length).toBeGreaterThan(0);
    for (const script of scripts) {
      expect(() => JSON.parse(script)).not.toThrow();
    }
  });
});
