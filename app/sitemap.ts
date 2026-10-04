import { MetadataRoute } from 'next';
import { siteUrl } from '@/app/(frontend)/[locale]/config/constants';
import { getAlternates } from '@/app/(frontend)/i18n/seo';
import { routing } from '@/app/(frontend)/i18n/routing';

type Page = {
  href: string;
  lastModified: Date;
  changeFrequency: 'monthly' | 'yearly';
  priority: number;
  translated?: boolean;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentYear = new Date().getFullYear();

  const yearPages: Page[] = [];

  for (let year = 2018; year <= currentYear; year++) {
    if (year === 2021) continue; // 2021 no tiene datos disponibles
    yearPages.push({
      href: `/statistics/${year}`,
      lastModified: year === currentYear ? new Date() : new Date(`${year}-01-20`),
      changeFrequency: 'yearly',
      priority: year === currentYear ? 0.9 : 0.7,
    });
  }

  const pages: Page[] = [
    { href: '/', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    {
      href: '/statistics/global',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    { href: '/search', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...yearPages,
    // Content only exists in Spanish: its canonical is the es URL, no hreflang
    {
      href: '/statistics/info',
      lastModified: new Date('2025-11-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
      translated: false,
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
