import './globals.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { StructuredData } from './config/structured-data/StructuredData';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { LayoutContent } from './LayoutContent';
import { orbitron, spaceGrotesk, jetbrainsMono } from './config/fonts';
import { routing } from '../i18n/routing';
import { getOpenGraphLocales } from '../i18n/seo';

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

  return (
    <html
      lang={locale}
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1549aa" />
        <StructuredData />
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

// Metadata
const siteUrl = 'https://tamborradata.com';
const imageUrl = `${siteUrl}/og-image.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Site');
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: 'Tamborradata',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'Tamborradata',
      images: [{ url: imageUrl, alt: title }],
      ...getOpenGraphLocales(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
      creator: '@tamborradata',
      site: '@tamborradata',
    },
  };
}
