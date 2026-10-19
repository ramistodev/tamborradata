export const GLOBAL_STATS_KEY = 'global';

// ─── SEO ────────────────────────────────────────────────────────────────────
// Single source of truth for the domain: every absolute URL is derived from `siteUrl`, so changing
// the domain means changing this one line.
export const siteUrl = 'https://tamborradata.com';
export const siteName = 'Tamborradata';
export const ogImageUrl = `${siteUrl}/og-image.webp`;
export const logoUrl = `${siteUrl}/logo-512x512.png`;

// `@id`s of the entities declared once in the root layout (see `StructuredData.tsx`), so the
// structured data of every page can point at them instead of repeating them.
export const organizationId = `${siteUrl}#organization`;
export const webSiteId = `${siteUrl}#website`;

// License of the published data, declared as `license` in every Dataset (Google asks for it).
export const licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/';

export const contactEmail = 'contact@tamborradata.com';
export const repositoryUrl = 'https://github.com/ramistodev/tamborradata';
export const buyMeACoffeeUrl = 'https://buymeacoffee.com/tamborradata';
