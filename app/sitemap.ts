import { MetadataRoute } from 'next';
import { siteUrl } from '@/app/(frontend)/[locale]/config/constants';
import { getPeriods } from '@/app/(frontend)/[locale]/services/getPeriods';
import { getAlternates } from '@/app/(frontend)/i18n/seo';
import { routing } from '@/app/(frontend)/i18n/routing';
import { periodKind } from '@/app/types/period.types';

type Page = {
  href: string;
  lastModified: Date;
  changeFrequency: 'monthly' | 'yearly';
  priority: number;
  translated?: boolean;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentYear = new Date().getFullYear();

  // The statistics pages come from the published periods, not from a hardcoded range of years:
  // a new edition (or an older one found later) reaches the sitemap by itself.
  const periods = await getPeriods().catch(() => []);
  const statisticsPages: Page[] = periods.map((period) => {
    const year = Number(period.publicSlug);
    const isCurrent = period.kind === periodKind.global || year >= currentYear;

    return {
      href: `/statistics/${period.publicSlug}`,
      lastModified: isCurrent ? new Date() : new Date(`${year}-01-20`),
      changeFrequency: 'yearly',
      priority: isCurrent ? 0.9 : 0.7,
    };
  });

  const pages: Page[] = [
    { href: '/', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { href: '/search-participants', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...statisticsPages,
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
