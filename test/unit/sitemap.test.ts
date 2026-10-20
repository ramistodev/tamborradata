import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import sitemap from '@/app/sitemap';
import { PAGES_UPDATED } from '@/app/(frontend)/[locale]/config/contentDates';
import { PRIVACY_POLICY_UPDATED } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants';
import { getOverview } from '@/app/(frontend)/[locale]/services/getOverview';
import { getPeriods } from '@/app/(frontend)/[locale]/services/getPeriods';
import { makeGlobalOverview, makeOverviewResponse } from '@/test/fixtures/overview';
import { makePeriod, makePeriodList } from '@/test/fixtures/period';

vi.mock('@/app/(frontend)/[locale]/services/getPeriods', () => ({ getPeriods: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/services/getOverview', () => ({ getOverview: vi.fn() }));

const BASE = 'https://tamborradata.com';

type Entries = Awaited<ReturnType<typeof sitemap>>;

function entriesOf(entries: Entries, path: string) {
  const suffix = path === '/' ? '' : path;
  return entries.filter((entry) =>
    [`${BASE}/en${suffix}`, `${BASE}${suffix}`, `${BASE}/eu${suffix}`].includes(entry.url)
  );
}

describe('sitemap', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-03-10T12:00:00.000Z') });
    vi.mocked(getPeriods).mockResolvedValue(makePeriodList());
    vi.mocked(getOverview).mockResolvedValue(makeOverviewResponse());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('entries', () => {
    it('requests the global overview with the nullable flag', async () => {
      await sitemap();

      expect(getOverview).toHaveBeenCalledWith('global', true);
    });

    it('creates (3 static pages + 4 periods) x 3 locales entries in page order', async () => {
      const entries = await sitemap();

      expect(entries).toHaveLength(21);
      const pathOrder = [
        '/',
        '/search-participants',
        '/statistics/global',
        '/statistics/2025',
        '/statistics/2024',
        '/statistics/2023',
        '/privacy-policy',
      ];
      const expectedUrls = pathOrder.flatMap((path) => {
        const suffix = path === '/' ? '' : path;
        return [`${BASE}/en${suffix}`, `${BASE}${suffix}`, `${BASE}/eu${suffix}`];
      });
      expect(entries.map((entry) => entry.url)).toEqual(expectedUrls);
    });

    it('lists the landing in the locales in routing order', async () => {
      const entries = await sitemap();

      expect(entries.slice(0, 3).map((entry) => entry.url)).toEqual([
        'https://tamborradata.com/en',
        'https://tamborradata.com',
        'https://tamborradata.com/eu',
      ]);
    });

    it('lists a period page in the locales in routing order', async () => {
      const entries = await sitemap();

      expect(entriesOf(entries, '/statistics/2024').map((entry) => entry.url)).toEqual([
        'https://tamborradata.com/en/statistics/2024',
        'https://tamborradata.com/statistics/2024',
        'https://tamborradata.com/eu/statistics/2024',
      ]);
    });

    it('uses the production site URL for every entry', async () => {
      const entries = await sitemap();

      for (const entry of entries) {
        expect(entry.url.startsWith('https://tamborradata.com')).toBe(true);
        expect(entry.url).not.toContain('localhost');
      }
    });

    it('declares the hreflang languages of every entry', async () => {
      const entries = await sitemap();

      for (const entry of entries) {
        expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual([
          'en',
          'es',
          'eu',
          'x-default',
        ]);
      }
    });
  });

  describe('priority and change frequency', () => {
    it('sets the static pages values', async () => {
      const entries = await sitemap();

      expect(entriesOf(entries, '/')[0]).toMatchObject({ priority: 1, changeFrequency: 'monthly' });
      expect(entriesOf(entries, '/search-participants')[0]).toMatchObject({
        priority: 0.9,
        changeFrequency: 'monthly',
      });
      expect(entriesOf(entries, '/privacy-policy')[0]).toMatchObject({
        priority: 0.4,
        changeFrequency: 'yearly',
      });
    });

    it('gives the period entries a yearly frequency', async () => {
      const entries = await sitemap();

      for (const slug of ['global', '2025', '2024', '2023']) {
        for (const entry of entriesOf(entries, `/statistics/${slug}`)) {
          expect(entry.changeFrequency).toBe('yearly');
        }
      }
    });

    it('favors the global and the current year periods', async () => {
      const entries = await sitemap();

      expect(entriesOf(entries, '/statistics/global')[0].priority).toBe(0.9);
      expect(entriesOf(entries, '/statistics/2025')[0].priority).toBe(0.7);
      expect(entriesOf(entries, '/statistics/2024')[0].priority).toBe(0.7);
    });

    it('promotes the period of the current year when the clock moves', async () => {
      vi.setSystemTime(new Date('2025-06-01T00:00:00.000Z'));

      const entries = await sitemap();

      expect(entriesOf(entries, '/statistics/2025')[0].priority).toBe(0.9);
      expect(entriesOf(entries, '/statistics/2024')[0].priority).toBe(0.7);
    });
  });

  describe('lastModified', () => {
    it('uses the publication date of each period', async () => {
      const entries = await sitemap();

      expect(entriesOf(entries, '/statistics/2024')[0].lastModified).toEqual(
        new Date('2025-02-01T10:00:00.000Z')
      );
    });

    it('leaves lastModified undefined when a period has no publication date', async () => {
      vi.mocked(getPeriods).mockResolvedValue([makePeriod({ lastPublishedAt: null })]);

      const entries = await sitemap();

      expect(entriesOf(entries, '/statistics/2024')[0].lastModified).toBeUndefined();
    });

    it('uses the pages floor date when the overview is older', async () => {
      const entries = await sitemap();

      expect(entriesOf(entries, '/')[0].lastModified).toEqual(new Date(PAGES_UPDATED));
      expect(entriesOf(entries, '/search-participants')[0].lastModified).toEqual(
        new Date(PAGES_UPDATED)
      );
    });

    it('uses the overview date when it is newer than the pages floor date', async () => {
      vi.mocked(getOverview).mockResolvedValue(
        makeOverviewResponse({
          globalPeriod: makeGlobalOverview({ lastPublishedAt: '2027-01-01T00:00:00.000Z' }),
        })
      );

      const entries = await sitemap();

      expect(entriesOf(entries, '/')[0].lastModified).toEqual(new Date('2027-01-01T00:00:00.000Z'));
      expect(entriesOf(entries, '/search-participants')[0].lastModified).toEqual(
        new Date('2027-01-01T00:00:00.000Z')
      );
    });

    it('falls back to the pages floor date when the overview is null', async () => {
      vi.mocked(getOverview).mockResolvedValue(null);

      const entries = await sitemap();

      expect(entriesOf(entries, '/')[0].lastModified).toEqual(new Date(PAGES_UPDATED));
    });

    it('uses the privacy policy update date', async () => {
      const entries = await sitemap();

      expect(entriesOf(entries, '/privacy-policy')[0].lastModified).toEqual(
        new Date(PRIVACY_POLICY_UPDATED)
      );
    });
  });

  describe('failure tolerance', () => {
    it('keeps only the static pages when the periods fail to load', async () => {
      vi.mocked(getPeriods).mockRejectedValue(new Error('periods down'));

      const entries = await sitemap();

      expect(entries).toHaveLength(9);
      expect(entries.some((entry) => entry.url.includes('/statistics/'))).toBe(false);
    });

    it('does not throw when the overview is null', async () => {
      vi.mocked(getOverview).mockResolvedValue(null);

      await expect(sitemap()).resolves.toHaveLength(21);
    });
  });
});
