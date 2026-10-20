import { describe, expect, it } from 'vitest';
import * as constants from '@/app/(frontend)/[locale]/config/constants';

describe('constants', () => {
  it.each([
    ['GLOBAL_STATS_KEY', 'global'],
    ['siteUrl', 'https://tamborradata.com'],
    ['siteName', 'Tamborradata'],
    ['ogImageUrl', 'https://tamborradata.com/og-image.webp'],
    ['logoUrl', 'https://tamborradata.com/logo-512x512.png'],
    ['organizationId', 'https://tamborradata.com#organization'],
    ['webSiteId', 'https://tamborradata.com#website'],
    ['licenseUrl', 'https://creativecommons.org/licenses/by-sa/4.0/'],
    ['contactEmail', 'contact@tamborradata.com'],
    ['repositoryUrl', 'https://github.com/ramistodev/tamborradata'],
    ['buyMeACoffeeUrl', 'https://buymeacoffee.com/tamborradata'],
  ] as const)('%s has the expected value', (name, expected) => {
    expect(constants[name]).toBe(expected);
  });

  it('has no trailing slash on the site url', () => {
    expect(constants.siteUrl.endsWith('/')).toBe(false);
  });

  it('starts every Url constant with https://', () => {
    const urls = Object.entries(constants).filter(([name]) => name.endsWith('Url'));

    expect(urls.length).toBeGreaterThan(0);
    for (const [, value] of urls) {
      expect(value).toMatch(/^https:\/\//);
    }
  });
});
