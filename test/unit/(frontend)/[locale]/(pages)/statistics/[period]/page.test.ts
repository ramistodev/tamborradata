import { createTranslator } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMetadata } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/page';
import { getPeriods } from '@/app/(frontend)/[locale]/services/getPeriods';
import { getStatistics } from '@/app/(frontend)/[locale]/services/getStatistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { setServerLocale } from '@/test/helpers/nextIntlServerMock';
import { makePeriodList } from '@/test/fixtures/period';
import { makeStatisticsMeta, makeStatisticsResponse } from '@/test/fixtures/statistics';

vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
vi.mock('@/app/(frontend)/[locale]/services/getStatistics', () => ({ getStatistics: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/services/getPeriods', () => ({ getPeriods: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/PageContent', () => ({
  PageContent: () => null,
}));
vi.mock('@/app/(frontend)/[locale]/config/structured-data/PeriodStructuredData', () => ({
  PeriodStructuredData: () => null,
}));

const params = (period: string) => Promise.resolve({ period });

describe('statistics period page generateMetadata', () => {
  beforeEach(() => {
    setServerLocale('es');
    vi.mocked(getStatistics).mockResolvedValue(makeStatisticsResponse());
    vi.mocked(getPeriods).mockResolvedValue(makePeriodList());
  });

  describe('year page', () => {
    it('requests the statistics of the period in the current locale', async () => {
      await generateMetadata({ params: params('2024') });

      expect(getStatistics).toHaveBeenCalledWith('2024', 'es');
    });

    it('builds the title and a description with the real figures', async () => {
      const metadata = await generateMetadata({ params: params('2024') });

      expect(metadata.title).toBe('Estadísticas de la Tamborrada Infantil 2024');
      expect(metadata.description).toContain('1.234');
      expect(metadata.description).toContain('Name 1');
    });

    it('builds the canonical', async () => {
      const metadata = await generateMetadata({ params: params('2024') });

      expect(metadata.alternates?.canonical).toBe('https://tamborradata.com/statistics/2024');
    });

    it('localizes the canonical in English', async () => {
      setServerLocale('en');

      const metadata = await generateMetadata({ params: params('2024') });

      expect(metadata.alternates?.canonical).toBe('https://tamborradata.com/en/statistics/2024');
    });

    it('builds the article Open Graph data and the Twitter images', async () => {
      const metadata = await generateMetadata({ params: params('2024') });

      expect(metadata.openGraph).toMatchObject({
        type: 'article',
        publishedTime: '2025-02-01T10:00:00.000Z',
        modifiedTime: '2025-02-01T10:00:00.000Z',
        images: [{ url: 'https://tamborradata.com/og-image.webp', alt: metadata.title }],
      });
      expect(metadata.twitter).toMatchObject({
        images: ['https://tamborradata.com/og-image.webp'],
      });
    });
  });

  describe('global page', () => {
    it('builds the historical title and description', async () => {
      vi.mocked(getStatistics).mockResolvedValue(
        makeStatisticsResponse({
          metaData: makeStatisticsMeta({ period: 'global', periodKind: 'global' }),
        })
      );

      const metadata = await generateMetadata({ params: params('global') });

      expect(metadata.title).toBe(
        'Estadísticas históricas de la Tamborrada Infantil (2023-2025)'
      );
      expect(metadata.description).toContain('1.234');
    });
  });

  describe('without overview participants', () => {
    it('uses the no-data description', async () => {
      vi.mocked(getStatistics).mockResolvedValue(makeStatisticsResponse({ overview: [] }));
      const t = createTranslator({
        locale: 'es',
        messages: messagesByLocale.es,
        namespace: 'Statistics',
      } as never) as unknown as (key: string, values: Record<string, string>) => string;

      const metadata = await generateMetadata({ params: params('2024') });

      expect(metadata.description).toBe(t('period.description', { period: '2024' }));
    });
  });

  describe('failures', () => {
    it('propagates a statistics failure', async () => {
      const failure = new Error('statistics down');
      vi.mocked(getStatistics).mockRejectedValue(failure);

      await expect(generateMetadata({ params: params('2024') })).rejects.toBe(failure);
    });
  });
});
