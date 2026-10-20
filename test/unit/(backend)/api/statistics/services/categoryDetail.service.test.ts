import { beforeEach, describe, expect, it, vi } from 'vitest';
import { categoryDetailService } from '@/app/(backend)/api/statistics/services/categoryDetail.service';
import { getPublishedPeriod } from '@/app/(backend)/api/statistics/repo/period.repo';
import { getPublishedStatisticByCategory } from '@/app/(backend)/api/statistics/repo/statisticHeaders.repo';
import {
  getSchoolGroupedRanksPage,
  getStatisticRanksPage,
} from '@/app/(backend)/api/statistics/repo/statisticRanks.repo';
import { getStatisticSeriesPage } from '@/app/(backend)/api/statistics/repo/statisticSeries.repo';
import { getAllStatisticValues } from '@/app/(backend)/api/statistics/repo/statisticValues.repo';
import { resolveSchoolIds } from '@/app/(backend)/api/statistics/repo/schools.repo';
import { NotFoundError, PeriodMovedError } from '@/app/(backend)/lib/errors';
import {
  makeRankRaw,
  makeSeriesPointRaw,
  makeStatisticsHeader,
  makeValueRaw,
} from '@/test/fixtures/dbRows';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/api/statistics/repo/period.repo', () => ({ getPublishedPeriod: vi.fn() }));
vi.mock('@/app/(backend)/api/statistics/repo/statisticHeaders.repo', () => ({
  getPublishedStatisticByCategory: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/statisticRanks.repo', () => ({
  getStatisticRanksPage: vi.fn(),
  getSchoolGroupedRanksPage: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/statisticSeries.repo', () => ({
  getStatisticSeriesPage: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/statisticValues.repo', () => ({
  getAllStatisticValues: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/schools.repo', () => ({ resolveSchoolIds: vi.fn() }));

beforeEach(() => {
  vi.mocked(getPublishedPeriod).mockResolvedValue({
    runId: 'run-1',
    kind: 'year',
    metaData: makeStatisticsMeta(),
  });
  vi.mocked(resolveSchoolIds).mockResolvedValue([
    { schoolId: 'sch-1', canonicalName: 'Escuela', schoolKey: 'escuela' },
  ]);
});

describe('categoryDetailService', () => {
  describe('values categories', () => {
    it('returns every value with an empty page info and never touches the paged repos', async () => {
      vi.mocked(getPublishedStatisticByCategory).mockResolvedValue(
        makeStatisticsHeader({
          id: 's1',
          category: 'totalParticipants',
          data_shape: 'values',
          renderer_key: 'metricCard',
          family: 'participationDynamics',
        }),
      );
      vi.mocked(getAllStatisticValues).mockResolvedValue([makeValueRaw('participant_count', 1234)]);

      const result = await categoryDetailService({
        publicSlug: '2024',
        category: 'totalParticipants',
        limit: 25,
      });

      expect(result).toEqual({
        category: 'totalParticipants',
        rendererKey: 'metricCard',
        dataShape: 'values',
        data: [{ metricKey: 'participant_count', valueNumeric: 1234 }],
        pageInfo: { nextCursor: null },
      });
      expect(getAllStatisticValues).toHaveBeenCalledWith('s1');
      expect(getStatisticRanksPage).not.toHaveBeenCalled();
      expect(getSchoolGroupedRanksPage).not.toHaveBeenCalled();
      expect(getStatisticSeriesPage).not.toHaveBeenCalled();
    });
  });

  describe('ranks categories', () => {
    it('pages the ranks with the limit and cursor and normalizes them', async () => {
      vi.mocked(getPublishedStatisticByCategory).mockResolvedValue(
        makeStatisticsHeader({ id: 's2', category: 'topNames' }),
      );
      vi.mocked(getStatisticRanksPage).mockResolvedValue({ items: [makeRankRaw()], nextCursor: 'n' });

      const result = await categoryDetailService({
        publicSlug: '2024',
        category: 'topNames',
        limit: 10,
        cursor: 'c',
      });

      expect(getPublishedStatisticByCategory).toHaveBeenCalledWith('run-1', 'topNames');
      expect(getStatisticRanksPage).toHaveBeenCalledWith('s2', { limit: 10, cursor: 'c' });
      expect(result.data).toEqual([
        { entityType: 'name', rank: 1, value: 10, entityKey: 'ane', entityLabel: 'Ane' },
      ]);
      expect(result.pageInfo).toEqual({ nextCursor: 'n' });
    });

    it('uses the school-grouped page for school-grouped categories', async () => {
      vi.mocked(getPublishedStatisticByCategory).mockResolvedValue(
        makeStatisticsHeader({
          id: 's-grouped',
          category: 'commonNameBySchool',
          data_shape: 'ranks',
          renderer_key: 'dataTable',
          family: 'schools',
        }),
      );
      vi.mocked(getSchoolGroupedRanksPage).mockResolvedValue({
        items: [makeRankRaw({ id: 'g1', group_school_id: 'sch-1' })],
        nextCursor: null,
      });

      const result = await categoryDetailService({
        publicSlug: '2024',
        category: 'commonNameBySchool',
        limit: 25,
      });

      expect(getSchoolGroupedRanksPage).toHaveBeenCalledWith('s-grouped', { limit: 25, cursor: undefined });
      expect(getStatisticRanksPage).not.toHaveBeenCalled();
      expect((result.data as Array<{ groupSchool?: unknown }>)[0].groupSchool).toEqual({
        canonicalName: 'Escuela',
        schoolKey: 'escuela',
      });
    });
  });

  describe('series categories', () => {
    it('pages the series of a global period', async () => {
      vi.mocked(getPublishedPeriod).mockResolvedValue({
        runId: 'run-1',
        kind: 'global',
        metaData: makeStatisticsMeta({ period: 'global', periodKind: 'global' }),
      });
      vi.mocked(getPublishedStatisticByCategory).mockResolvedValue(
        makeStatisticsHeader({
          id: 's3',
          category: 'nameTrends',
          data_shape: 'series',
          renderer_key: 'lineChart',
          family: 'names',
        }),
      );
      vi.mocked(getStatisticSeriesPage).mockResolvedValue({
        items: [makeSeriesPointRaw()],
        nextCursor: 'series-next',
      });

      const result = await categoryDetailService({
        publicSlug: 'global',
        category: 'nameTrends',
        limit: 25,
      });

      expect(getStatisticSeriesPage).toHaveBeenCalledWith('s3', { limit: 25, cursor: undefined });
      expect(result.dataShape).toBe('series');
      expect(result.pageInfo).toEqual({ nextCursor: 'series-next' });
    });
  });

  describe('errors', () => {
    it('rejects with an integrity error when the stored presentation disagrees', async () => {
      vi.mocked(getPublishedStatisticByCategory).mockResolvedValue(
        makeStatisticsHeader({ category: 'topNames', data_shape: 'values' }),
      );

      const promise = categoryDetailService({ publicSlug: '2024', category: 'topNames', limit: 25 });

      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toThrow(/^Integrity error:/);
    });

    it('propagates a NotFoundError from the header repo unchanged', async () => {
      const error = new NotFoundError('x');
      vi.mocked(getPublishedStatisticByCategory).mockRejectedValue(error);

      await expect(
        categoryDetailService({ publicSlug: '2024', category: 'topNames', limit: 25 }),
      ).rejects.toBe(error);
    });

    it('propagates a PeriodMovedError from the period repo unchanged', async () => {
      const error = new PeriodMovedError('2024');
      vi.mocked(getPublishedPeriod).mockRejectedValue(error);

      await expect(
        categoryDetailService({ publicSlug: '2024-old', category: 'topNames', limit: 25 }),
      ).rejects.toBe(error);
    });
  });
});
