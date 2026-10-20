import { beforeEach, describe, expect, it, vi } from 'vitest';
import RootLayout, {
  generateMetadata,
  generateStaticParams,
  viewport,
} from '@/app/(frontend)/[locale]/layout';
import { getOverview } from '@/app/(frontend)/[locale]/services/getOverview';
import { setServerLocale } from '@/test/helpers/nextIntlServerMock';
import { makeOverviewResponse } from '@/test/fixtures/overview';

vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
vi.mock('@/app/(frontend)/[locale]/services/getOverview', () => ({ getOverview: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/config/fonts', () => ({
  sora: { variable: 'v-sora' },
  spaceGrotesk: { variable: 'v-sg' },
  jetbrainsMono: { variable: 'v-jb' },
}));
vi.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => null }));
vi.mock('@/app/(frontend)/[locale]/LayoutContent', () => ({ LayoutContent: () => null }));
vi.mock('@/app/(frontend)/[locale]/providers/ReactQueryProvider', () => ({
  ReactQueryProvider: () => null,
}));
vi.mock('@/app/(frontend)/[locale]/config/structured-data/StructuredData', () => ({
  StructuredData: () => null,
}));

describe('root layout', () => {
  beforeEach(() => {
    setServerLocale('es');
    vi.mocked(getOverview).mockResolvedValue(makeOverviewResponse());
  });

  describe('generateStaticParams', () => {
    it('returns one entry per locale in routing order', () => {
      expect(generateStaticParams()).toEqual([{ locale: 'en' }, { locale: 'es' }, { locale: 'eu' }]);
    });
  });

  describe('viewport', () => {
    it('sets the theme color of each color scheme', () => {
      expect(viewport.themeColor).toEqual([
        { media: '(prefers-color-scheme: light)', color: '#f6f8fc' },
        { media: '(prefers-color-scheme: dark)', color: '#060912' },
      ]);
    });
  });

  describe('generateMetadata', () => {
    it('builds the site-wide texts from the overview', async () => {
      const metadata = await generateMetadata();

      expect(metadata.title).toBe('Tamborradata | Datos y estadísticas de la Tamborrada Infantil');
      expect(metadata.description).toBe(
        'Explora datos y estadísticas de la Tamborrada Infantil de Donostia-San Sebastián: participación, nombres y colegios desde 2000.'
      );
    });

    it('uses the fallback description without an overview', async () => {
      vi.mocked(getOverview).mockResolvedValue(null);

      const metadata = await generateMetadata();

      expect(metadata.description).toBe(
        'Explora datos y estadísticas de la Tamborrada Infantil de Donostia-San Sebastián: participación, nombres y colegios de todas las ediciones.'
      );
    });

    it('requests the global overview with the nullable flag', async () => {
      await generateMetadata();

      expect(getOverview).toHaveBeenCalledWith('global', true);
    });

    it('sets the base URL, the application name, the manifest and the robots', async () => {
      const metadata = await generateMetadata();

      expect(new URL(metadata.metadataBase ?? '').href).toBe('https://tamborradata.com/');
      expect(metadata.applicationName).toBe('Tamborradata');
      expect(metadata.manifest).toBe('/site.webmanifest');
      expect(metadata.robots).toEqual({ index: true, follow: true });
    });

    it('sets the Open Graph URL without a locale prefix and the Twitter card', async () => {
      const metadata = await generateMetadata();

      expect(metadata.openGraph).toMatchObject({
        url: 'https://tamborradata.com',
        type: 'website',
      });
      expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    });

    it.each([
      { locale: 'es', ogLocale: 'es_ES' },
      { locale: 'en', ogLocale: 'en_US' },
      { locale: 'eu', ogLocale: 'eu_ES' },
    ] as const)('sets the Open Graph locale of $locale', async ({ locale, ogLocale }) => {
      setServerLocale(locale);

      const metadata = await generateMetadata();

      expect(metadata.openGraph).toMatchObject({ locale: ogLocale });
    });
  });

  describe('RootLayout', () => {
    it('responds with a 404 for an unsupported locale', async () => {
      await expect(
        RootLayout({ children: null, params: Promise.resolve({ locale: 'fr' }) })
      ).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });
    });

    it('renders the html element with the locale and the font variables', async () => {
      const element = await RootLayout({
        children: null,
        params: Promise.resolve({ locale: 'eu' }),
      });

      expect(element.type).toBe('html');
      expect(element.props.lang).toBe('eu');
      expect(element.props.className).toBe('v-sora v-sg v-jb');
      expect(getOverview).toHaveBeenCalledWith('global', true);
    });
  });
});
