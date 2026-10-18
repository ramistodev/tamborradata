/**
 * The dates the website tells search engines about itself, in one place so the structured data
 * (`datePublished`, `dateModified`) and the sitemap (`lastmod`) never disagree.
 */

/** First public version of the website (ISO 8601): the date of its first public commit, 18 Nov 2025. */
export const SITE_PUBLISHED = '2025-11-18T00:00:00.000Z';

/**
 * The last time the landing and the search page changed in design or content (the redesign and the
 * move to /search-participants). Change it when you change them again. It is the floor of their
 * modification date: when a newer edition is published, its date is later and takes over.
 */
export const PAGES_UPDATED = '2026-10-17T00:00:00.000Z';

/** ISO strings of the same format sort as dates, so the latest one is the greatest. */
export const latestDate = (...dates: (string | null | undefined)[]) =>
  dates
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
