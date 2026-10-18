import { MetadataRoute } from 'next';
import { siteUrl } from '@/app/(frontend)/[locale]/config/constants';
import { PAGES_UPDATED, latestDate } from '@/app/(frontend)/[locale]/config/contentDates';
import { getOverview } from '@/app/(frontend)/[locale]/services/getOverview';
import { getPeriods } from '@/app/(frontend)/[locale]/services/getPeriods';
import { PRIVACY_POLICY_UPDATED } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants';
import { getAlternates } from '@/app/(frontend)/i18n/seo';
import { routing } from '@/app/(frontend)/i18n/routing';
import { overviewScope } from '@/app/types/api/overview.types';
import { periodKind } from '@/app/types/period.types';

type Page = {
  href: string;
  /** Real modification date. Left out when it is not known: a made-up one is worse than none. */
  lastModified?: Date;
  changeFrequency: 'monthly' | 'yearly';
  priority: number;
  translated?: boolean;
};

const toDate = (iso: string | null | undefined) => (iso ? new Date(iso) : undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentYear = new Date().getFullYear();

  // The statistics pages come from the published periods, not from a hardcoded range of years:
  // a new edition (or an older one found later) reaches the sitemap by itself.
  const [periods, overview] = await Promise.all([
    getPeriods().catch(() => []),
    getOverview(overviewScope.global, true),
  ]);

  const statisticsPages: Page[] = periods.map((period) => {
    const year = Number(period.publicSlug);
    const isCurrent = period.kind === periodKind.global || year >= currentYear;

    return {
      href: `/statistics/${period.publicSlug}`,
      // When the period was last published, which is when its numbers last changed
      lastModified: toDate(period.lastPublishedAt),
      changeFrequency: 'yearly',
      priority: isCurrent ? 0.9 : 0.7,
    };
  });

  // The landing and the search page show the figures of the overview, so they change when a new
  // edition is published, and when their design changes (`PAGES_UPDATED`)
  const sitePagesModified = toDate(
    latestDate(PAGES_UPDATED, overview?.globalPeriod?.lastPublishedAt)
  );

  const pages: Page[] = [
    { href: '/', lastModified: sitePagesModified, changeFrequency: 'monthly', priority: 1.0 },
    {
      href: '/search-participants',
      lastModified: sitePagesModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...statisticsPages,
    {
      href: '/privacy-policy',
      lastModified: toDate(PRIVACY_POLICY_UPDATED),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  return pages.flatMap(({ href, translated = true, ...meta }) => {
    if (!translated) {
      return [{ url: `${siteUrl}${href}`, ...meta }];
    }

    return routing.locales.map((locale) => {
      const { canonical, languages } = getAlternates(locale, href);
      return { url: canonical, ...meta, alternates: { languages } };
    });
  });
}
