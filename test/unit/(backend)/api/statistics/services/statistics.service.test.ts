import { beforeEach, describe, expect, it, vi } from 'vitest';
import { statisticsService } from '@/app/(backend)/api/statistics/services/statistics.service';
import { getPublishedPeriod } from '@/app/(backend)/api/statistics/repo/period.repo';
import { getPublishedStatisticHeaders } from '@/app/(backend)/api/statistics/repo/statisticHeaders.repo';
import { getOptionalEditorialSections } from '@/app/(backend)/api/statistics/repo/editorialSections.repo';
import {
  getSchoolGroupedRanksPreview,
  getStatisticRanksPreview,
} from '@/app/(backend)/api/statistics/repo/statisticRanks.repo';
import { getStatisticSeriesPreview } from '@/app/(backend)/api/statistics/repo/statisticSeries.repo';
import { getAllStatisticValues } from '@/app/(backend)/api/statistics/repo/statisticValues.repo';
import { resolveSchoolIds } from '@/app/(backend)/api/statistics/repo/schools.repo';
import { PeriodMovedError, ServerError } from '@/app/(backend)/lib/errors';
import {
  makePublishedSection,
  makeRankRaw,
  makeSeriesPointRaw,
  makeStatisticsHeader,
  makeValueRaw,
} from '@/test/fixtures/dbRows';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/statistics/repo/period.repo', () => ({ getPublishedPeriod: vi.fn() }));
vi.mock('@/app/(backend)/api/statistics/repo/statisticHeaders.repo', () => ({
  getPublishedStatisticHeaders: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/editorialSections.repo', () => ({
  getOptionalEditorialSections: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/statisticRanks.repo', () => ({
  getSchoolGroupedRanksPreview: vi.fn(),
  getStatisticRanksPreview: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/statisticSeries.repo', () => ({
  getStatisticSeriesPreview: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/statisticValues.repo', () => ({
  getAllStatisticValues: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/schools.repo', () => ({ resolveSchoolIds: vi.fn() }));

const params = { publicSlug: '2024', locale: 'es' } as const;

beforeEach(() => {
  vi.mocked(getPublishedPeriod).mockResolvedValue({
    runId: 'run-1',
    kind: 'year',
    metaData: makeStatisticsMeta(),
  });
  vi.mocked(getPublishedStatisticHeaders).mockResolvedValue([
    makeStatisticsHeader({
      id: 's-total',
      category: 'totalParticipants',
      data_shape: 'values',
      renderer_key: 'metricCard',
      family: 'participationDynamics',
    }),
    makeStatisticsHeader({ id: 's-top', category: 'topNames' }),
    makeStatisticsHeader({
      id: 's-grouped',
      category: 'commonNameBySchool',
      data_shape: 'ranks',
      renderer_key: 'dataTable',
      family: 'schools',
    }),
  ]);
  vi.mocked(getAllStatisticValues).mockResolvedValue([
    makeValueRaw('participant_count', 1234),
    makeValueRaw('eligible_resolved_participants', 99),
  ]);
  vi.mocked(getStatisticRanksPreview).mockResolvedValue({ items: [makeRankRaw()], nextCursor: 'next' });
  vi.mocked(getSchoolGroupedRanksPreview).mockResolvedValue({
    items: [makeRankRaw({ id: 'g1', group_school_id: 'sch-1' })],
    nextCursor: null,
  });
  vi.mocked(resolveSchoolIds).mockResolvedValue([
    { schoolId: 'sch-1', canonicalName: 'Escuela', schoolKey: 'escuela' },
  ]);
  vi.mocked(getOptionalEditorialSections).mockResolvedValue([]);
});

describe('statisticsService', () => {
  describe('repo calls', () => {
    it('queries each repo with the right arguments', async () => {
      await statisticsService(params);

      expect(getPublishedPeriod).toHaveBeenCalledWith('2024');
      expect(getPublishedStatisticHeaders).toHaveBeenCalledWith('run-1');
      expect(getOptionalEditorialSections).toHaveBeenCalledWith('run-1', 'es');
      expect(getAllStatisticValues).toHaveBeenCalledWith('s-total');
    });

    it('uses the plain ranks preview for regular rankings only', async () => {
      await statisticsService(params);

      expect(getStatisticRanksPreview).toHaveBeenCalledWith('s-top');
      expect(getStatisticRanksPreview).not.toHaveBeenCalledWith('s-grouped');
    });

    it('uses the school-grouped preview for school-grouped rankings only', async () => {
      await statisticsService(params);

      expect(getSchoolGroupedRanksPreview).toHaveBeenCalledWith('s-grouped');
      expect(getSchoolGroupedRanksPreview).not.toHaveBeenCalledWith('s-top');
    });
  });

  describe('response shape', () => {
    it('returns the period metadata', async () => {
      const result = await statisticsService(params);

      expect(result.metaData).toEqual(makeStatisticsMeta());
    });

    it('builds the overview only from allowed metrics', async () => {
      const result = await statisticsService(params);

      expect(result.overview).toEqual([
        { category: 'totalParticipants', metricKey: 'participant_count', valueNumeric: 1234 },
      ]);
    });

    it('sorts the families by name', async () => {
      const result = await statisticsService(params);

      expect(result.families.map((family) => family.family)).toEqual([
        'names',
        'participationDynamics',
        'schools',
      ]);
    });

    it('normalizes a ranks category with its page info', async () => {
      const result = await statisticsService(params);

      const names = result.families.find((family) => family.family === 'names');
      expect(names?.categories).toHaveLength(1);
      expect(names?.categories[0]).toStrictEqual({
        category: 'topNames',
        dataShape: 'ranks',
        rendererKey: 'horizontalRanking',
        pageInfo: { nextCursor: 'next' },
        data: [{ entityType: 'name', rank: 1, value: 10, entityKey: 'ane', entityLabel: 'Ane' }],
      });
    });

    it('resolves the group school of a school-grouped ranking', async () => {
      const result = await statisticsService(params);

      const schools = result.families.find((family) => family.family === 'schools');
      const category = schools?.categories[0];
      expect(category).toMatchObject({ category: 'commonNameBySchool', pageInfo: { nextCursor: null } });
      expect((category?.data as Array<{ groupSchool?: unknown }>)[0].groupSchool).toEqual({
        canonicalName: 'Escuela',
        schoolKey: 'escuela',
      });
    });

    it('defaults intro, outro and family templates to empty summaries', async () => {
      const result = await statisticsService(params);

      expect(result.intro).toEqual({ section: 'periodIntro', summary: '' });
      expect(result.outro).toEqual({ section: 'periodOutro', summary: '' });
      for (const family of result.families) {
        expect(family.template).toEqual({ section: family.family, summary: '' });
      }
    });
  });

  describe('summaries', () => {
    it('resolves school placeholders and assigns family templates', async () => {
      vi.mocked(getOptionalEditorialSections).mockResolvedValue([
        makePublishedSection({ section: 'periodIntro', template: 'Intro {{school:sch-1}}' }),
        makePublishedSection({ id: 'sum-2', section: 'names', template: 'Names text' }),
      ]);

      const result = await statisticsService(params);

      expect(result.intro.summary).toBe('Intro Escuela');
      const names = result.families.find((family) => family.family === 'names');
      expect(names?.template).toEqual({ section: 'names', summary: 'Names text' });
    });
  });

  describe('unknown categories', () => {
    it('skips a category that no longer exists without calling any data repo for it', async () => {
      vi.mocked(getPublishedStatisticHeaders).mockResolvedValue([
        makeStatisticsHeader({ id: 's-top', category: 'topNames' }),
        makeStatisticsHeader({ id: 's-old', category: 'oldCategory' as never }),
      ]);

      const result = await statisticsService(params);

      const categories = result.families.flatMap((family) => family.categories.map((c) => c.category));
      expect(categories).toEqual(['topNames']);
      for (const repo of [
        getStatisticRanksPreview,
        getSchoolGroupedRanksPreview,
        getAllStatisticValues,
        getStatisticSeriesPreview,
      ]) {
        expect(repo).not.toHaveBeenCalledWith('s-old');
      }
    });
  });

  describe('global period', () => {
    beforeEach(() => {
      vi.mocked(getPublishedPeriod).mockResolvedValue({
        runId: 'run-1',
        kind: 'global',
        metaData: makeStatisticsMeta({ period: 'global', periodKind: 'global' }),
      });
    });

    it('loads series categories through the series preview', async () => {
      vi.mocked(getPublishedStatisticHeaders).mockResolvedValue([
        makeStatisticsHeader({
          id: 's-series',
          category: 'nameTrends',
          data_shape: 'series',
          renderer_key: 'lineChart',
          family: 'names',
        }),
      ]);
      vi.mocked(getStatisticSeriesPreview).mockResolvedValue([makeSeriesPointRaw()]);

      const result = await statisticsService({ publicSlug: 'global', locale: 'es' });

      expect(getStatisticSeriesPreview).toHaveBeenCalledWith('s-series');
      expect(result.families[0].categories[0].dataShape).toBe('series');
    });

    it('does not add series-shaped categories to the overview', async () => {
      vi.mocked(getPublishedStatisticHeaders).mockResolvedValue([
        makeStatisticsHeader({
          id: 's-growth',
          category: 'participantsGrowthRate',
          data_shape: 'series',
          renderer_key: 'lineChart',
          family: 'participationDynamics',
        }),
      ]);
      vi.mocked(getStatisticSeriesPreview).mockResolvedValue([makeSeriesPointRaw()]);

      const result = await statisticsService({ publicSlug: 'global', locale: 'es' });

      expect(result.overview).toEqual([]);
    });
  });

  describe('integrity', () => {
    it('rejects when the stored data shape disagrees with the category configuration', async () => {
      vi.mocked(getPublishedStatisticHeaders).mockResolvedValue([
        makeStatisticsHeader({ data_shape: 'values' }),
      ]);

      const promise = statisticsService(params);

      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toThrow(/^Integrity error: published statistic "topNames"/);
    });
  });

  describe('error propagation', () => {
    it('propagates a PeriodMovedError from the period repo', async () => {
      const error = new PeriodMovedError('2024');
      vi.mocked(getPublishedPeriod).mockRejectedValue(error);

      await expect(statisticsService(params)).rejects.toBe(error);
    });

    it('propagates a header repo failure', async () => {
      const error = new ServerError('x');
      vi.mocked(getPublishedStatisticHeaders).mockRejectedValue(error);

      await expect(statisticsService(params)).rejects.toBe(error);
    });

    it('propagates a values repo failure', async () => {
      const error = new Error('values down');
      vi.mocked(getAllStatisticValues).mockRejectedValue(error);

      await expect(statisticsService(params)).rejects.toBe(error);
    });
  });
});
