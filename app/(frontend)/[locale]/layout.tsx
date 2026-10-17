import './globals.css';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { StructuredData } from './config/structured-data/StructuredData';
import { ogImageUrl, siteName, siteUrl } from './config/constants';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { LayoutContent } from './LayoutContent';
import { sora, spaceGrotesk, jetbrainsMono } from './config/fonts';
import { getOverview } from './services/getOverview';
import { routing } from '../i18n/routing';
import { getOpenGraphLocales } from '../i18n/seo';
import { overviewScope } from '../../types/api/overview.types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // The same cached call as in `generateMetadata`, so nothing is fetched twice
  const overview = await getOverview(overviewScope.global, true);

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      {/* Next adds the charset and viewport meta tags, the icons and the manifest on its own */}
      <head>
        <StructuredData overview={overview} />
      </head>
      <body>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <LayoutContent>{children}</LayoutContent>
          </ReactQueryProvider>
        </NextIntlClientProvider>
        <SpeedInsights /> {/* Vercel Speed Insights */}
        <Analytics /> {/* Vercel Analytics */}
      </body>
    </html>
  );
}

// The browser bars take the page background (the `--bg` token of each theme)
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#060912' },
  ],
};

/**
 * What every page inherits: the base URL (so a page can use relative URLs), the icons and the web
 * app manifest, the application name and the default robots, Open Graph and Twitter data. A page
 * overrides whatever it declares itself.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const [t, overview] = await Promise.all([
    getTranslations('Site'),
    getOverview(overviewScope.global, true),
  ]);
  const globalPeriod = overview?.globalPeriod;
  const title = t('title');
  const description = globalPeriod
    ? t('description', { startYear: String(globalPeriod.startYear) })
    : t('descriptionFallback');

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: siteName,
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName,
      images: [{ url: ogImageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
      creator: '@tamborradata',
      site: '@tamborradata',
    },
  };
}
