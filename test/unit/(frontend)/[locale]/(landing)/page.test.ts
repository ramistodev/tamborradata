import { createTranslator } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMetadata } from '@/app/(frontend)/[locale]/(landing)/page';
import { getOverview } from '@/app/(frontend)/[locale]/services/getOverview';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { setServerLocale } from '@/test/helpers/nextIntlServerMock';
import { makeOverviewResponse } from '@/test/fixtures/overview';

vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
vi.mock('@/app/(frontend)/[locale]/services/getOverview', () => ({ getOverview: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(landing)/Landing', () => ({ Landing: () => null }));
vi.mock('@/app/(frontend)/[locale]/config/structured-data/LandingStructuredData', () => ({
  LandingStructuredData: () => null,
}));

function translatorFor(locale: (typeof LOCALES)[number]) {
  return createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Landing.metadata',
  } as never) as unknown as (key: string, values?: Record<string, string>) => string;
}

describe('landing page generateMetadata', () => {
  beforeEach(() => {
    setServerLocale('es');
    vi.mocked(getOverview).mockResolvedValue(makeOverviewResponse());
  });

  describe('es with the default overview', () => {
    it('requests both scopes with the nullable flag', async () => {
      await generateMetadata();

      expect(getOverview).toHaveBeenCalledWith('both', true);
    });

    it('builds the title, description and keywords', async () => {
      const metadata = await generateMetadata();

      expect(metadata.title).toBe('Tamborradata');
      expect(metadata.description).toBe(
        'Archivo histórico y estadístico de la Tamborrada Infantil de Donostia: participaciones, nombres y colegios de 2000 a 2025, y un buscador de participantes.'
      );
      expect(metadata.keywords).toBe(
        'Tamborradata, Tamborrada Infantil, estadísticas Tamborrada, datos Tamborrada'
      );
    });

    it('builds the canonical and the hreflang alternates', async () => {
      const metadata = await generateMetadata();

      expect(metadata.alternates?.canonical).toBe('https://tamborradata.com');
      expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual([
        'en',
        'es',
        'eu',
        'x-default',
      ]);
    });

    it('builds the Open Graph data', async () => {
      const metadata = await generateMetadata();

      expect(metadata.openGraph).toMatchObject({
        title: metadata.title,
        description: metadata.description,
        url: metadata.alternates?.canonical,
        siteName: 'Tamborradata',
        type: 'website',
        locale: 'es_ES',
        alternateLocale: ['en_US', 'eu_ES'],
        images: [{ url: 'https://tamborradata.com/og-image.webp', alt: 'Tamborradata' }],
      });
    });

    it('builds the Twitter card', async () => {
      const metadata = await generateMetadata();

      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        site: '@tamborradata',
      });
    });

    it('allows indexing', async () => {
      const metadata = await generateMetadata();

      expect(metadata.robots).toMatchObject({ index: true });
    });
  });

  describe('without an overview', () => {
    it('uses the fallback description', async () => {
      vi.mocked(getOverview).mockResolvedValue(null);

      const metadata = await generateMetadata();

      expect(metadata.description).toBe(
        'Archivo histórico y estadístico de la Tamborrada Infantil de Donostia: participaciones, nombres y colegios de cada edición, y un buscador de participantes.'
      );
    });
  });

  describe.each([
    { locale: 'en', canonical: 'https://tamborradata.com/en', ogLocale: 'en_US' },
    { locale: 'eu', canonical: 'https://tamborradata.com/eu', ogLocale: 'eu_ES' },
  ] as const)('$locale', ({ locale, canonical, ogLocale }) => {
    it('localizes the canonical, the Open Graph locale and the texts', async () => {
      setServerLocale(locale);
      const t = translatorFor(locale);

      const metadata = await generateMetadata();

      expect(metadata.alternates?.canonical).toBe(canonical);
      expect(metadata.openGraph).toMatchObject({ locale: ogLocale });
      expect(metadata.title).toBe(t('title'));
      expect(metadata.description).toBe(t('description', { startYear: '2000', endYear: '2025' }));
    });
  });
});
