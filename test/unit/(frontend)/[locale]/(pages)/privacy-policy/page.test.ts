import { createTranslator } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMetadata } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/page';
import {
  PRIVACY_POLICY_PUBLISHED,
  PRIVACY_POLICY_UPDATED,
} from '@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { setServerLocale } from '@/test/helpers/nextIntlServerMock';

vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
vi.mock('@/app/(frontend)/[locale]/(pages)/privacy-policy/PageContent', () => ({
  PageContent: () => null,
}));
vi.mock('@/app/(frontend)/[locale]/config/structured-data/PolicyPrivacyStructuredData', () => ({
  PolicyPrivacyStructuredData: () => null,
}));

const CASES = {
  es: { canonical: 'https://tamborradata.com/privacy-policy', ogLocale: 'es_ES' },
  en: { canonical: 'https://tamborradata.com/en/privacy-policy', ogLocale: 'en_US' },
  eu: { canonical: 'https://tamborradata.com/eu/privacy-policy', ogLocale: 'eu_ES' },
} as const;

describe('privacy policy page generateMetadata', () => {
  beforeEach(() => {
    setServerLocale('es');
  });

  describe.each(LOCALES)('%s', (locale) => {
    it('builds the title and description from the translations', async () => {
      setServerLocale(locale);
      const translator = createTranslator({
        locale,
        messages: messagesByLocale[locale],
        namespace: 'PrivacyPolicy.metadata',
      } as never) as unknown as (key: string) => string;

      const metadata = await generateMetadata();

      expect(metadata.title).toBe(`${translator('title')} | Tamborradata`);
      expect(metadata.description).toBe(translator('description'));
    });

    it('builds the canonical, the article dates and the Open Graph locale', async () => {
      setServerLocale(locale);

      const metadata = await generateMetadata();

      expect(metadata.alternates?.canonical).toBe(CASES[locale].canonical);
      expect(metadata.openGraph).toMatchObject({
        type: 'article',
        url: CASES[locale].canonical,
        publishedTime: PRIVACY_POLICY_PUBLISHED,
        modifiedTime: PRIVACY_POLICY_UPDATED,
        locale: CASES[locale].ogLocale,
      });
    });

    it('allows indexing', async () => {
      setServerLocale(locale);

      const metadata = await generateMetadata();

      expect(metadata.robots).toMatchObject({ index: true });
    });
  });
});
