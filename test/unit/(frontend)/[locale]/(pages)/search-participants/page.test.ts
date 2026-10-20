import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMetadata } from '@/app/(frontend)/[locale]/(pages)/search-participants/page';
import { getOverview } from '@/app/(frontend)/[locale]/services/getOverview';
import { setServerLocale } from '@/test/helpers/nextIntlServerMock';
import { makeOverviewResponse } from '@/test/fixtures/overview';

vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
vi.mock('@/app/(frontend)/[locale]/services/getOverview', () => ({ getOverview: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/services/getSchools', () => ({ getSchools: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(pages)/search-participants/PageContent', () => ({
  PageContent: () => null,
}));
vi.mock('@/app/(frontend)/[locale]/config/structured-data/SearchParticipantsStructuredData', () => ({
  SearchParticipantsStructuredData: () => null,
}));

describe('search page generateMetadata', () => {
  beforeEach(() => {
    setServerLocale('es');
    vi.mocked(getOverview).mockResolvedValue(makeOverviewResponse());
  });

  it('requests the global overview with the nullable flag', async () => {
    await generateMetadata();

    expect(getOverview).toHaveBeenCalledWith('global', true);
  });

  it('builds the title and description from the overview years', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe('Buscar participante de la Tamborrada Infantil de Donostia');
    expect(metadata.description).toBe(
      'Busca participantes de la Tamborrada Infantil de Donostia por nombre y colegio y mira en qué años salieron. Ediciones de 2000 a 2025.'
    );
  });

  it('uses the fallback description without an overview', async () => {
    vi.mocked(getOverview).mockResolvedValue(null);

    const metadata = await generateMetadata();

    expect(metadata.description).toBe(
      'Busca participantes de la Tamborrada Infantil de Donostia por nombre y colegio y mira en qué años salieron, con enlace a la fuente original.'
    );
  });

  it('builds the canonical', async () => {
    const metadata = await generateMetadata();

    expect(metadata.alternates?.canonical).toBe('https://tamborradata.com/search-participants');
  });

  it('builds the Twitter images as a plain URL list and allows indexing', async () => {
    const metadata = await generateMetadata();

    expect(metadata.twitter).toMatchObject({
      images: ['https://tamborradata.com/og-image.webp'],
    });
    expect(metadata.robots).toMatchObject({ index: true });
  });

  describe.each([
    { locale: 'es', canonical: 'https://tamborradata.com/search-participants', ogLocale: 'es_ES' },
    { locale: 'en', canonical: 'https://tamborradata.com/en/search-participants', ogLocale: 'en_US' },
    { locale: 'eu', canonical: 'https://tamborradata.com/eu/search-participants', ogLocale: 'eu_ES' },
  ] as const)('$locale', ({ locale, canonical, ogLocale }) => {
    it('localizes the canonical and the Open Graph data', async () => {
      setServerLocale(locale);

      const metadata = await generateMetadata();

      expect(metadata.alternates?.canonical).toBe(canonical);
      expect(metadata.openGraph).toMatchObject({
        type: 'website',
        url: canonical,
        locale: ogLocale,
      });
    });
  });
});
