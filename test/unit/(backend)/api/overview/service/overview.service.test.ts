import { beforeEach, describe, expect, it, vi } from 'vitest';
import { overviewService } from '@/app/(backend)/api/overview/service/overview.service';
import {
  countRankedSchools,
  getOverviewStatistics,
  getPublishedPeriods,
} from '@/app/(backend)/api/overview/repo/overview.repo';
import { NotFoundError, ServerError } from '@/app/(backend)/lib/errors';
import { makeOverviewPeriodRow, makeOverviewStatisticRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/api/overview/repo/overview.repo', () => ({
  getPublishedPeriods: vi.fn(),
  getOverviewStatistics: vi.fn(),
  countRankedSchools: vi.fn(),
}));

const globalRow = makeOverviewPeriodRow({
  kind: 'global',
  public_slug: 'global',
  published_run_id: 'run-global',
  start_year: 2000,
  end_year: 2005,
});

const yearRow = (y: number) =>
  makeOverviewPeriodRow({
    kind: 'year',
    public_slug: String(y),
    published_run_id: `run-${y}`,
    start_year: y,
    end_year: y,
  });

function fullStatistics() {
  return [
    makeOverviewStatisticRow('totalParticipants', {
      statistic_values: [{ metric_key: 'participant_count', value_numeric: 1234 }],
    }),
    makeOverviewStatisticRow('participantsGrowthRate', {
      statistic_values: [{ metric_key: 'growth_rate', value_numeric: 2.5 }],
    }),
    makeOverviewStatisticRow('topNames', {
      statistic_ranks: [{ entity_label: 'Ane', value: 100, schools: null }],
    }),
    makeOverviewStatisticRow('topSurnames', {
      statistic_ranks: [{ entity_label: 'Garcia', value: 200, schools: null }],
    }),
    makeOverviewStatisticRow('topSchools', {
      id: 'top-schools-id',
      statistic_ranks: [
        { entity_label: 'Raw School', value: 300, schools: { canonical_name: 'Ikastola Canonical' } },
      ],
    }),
  ];
}

/** Same as fullStatistics() but replaces (or removes, with undefined) one category. */
function statisticsWith(category: string, replacement?: ReturnType<typeof makeOverviewStatisticRow>) {
  const rest = fullStatistics().filter((statistic) => statistic.category !== category);
  return replacement ? [...rest, replacement] : rest;
}

beforeEach(() => {
  vi.mocked(getOverviewStatistics).mockResolvedValue(fullStatistics());
  vi.mocked(countRankedSchools).mockResolvedValue(87);
});

describe('overviewService', () => {
  describe('scope both', () => {
    it('builds the global and the last period', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([
        globalRow,
        yearRow(2000),
        yearRow(2001),
        yearRow(2003),
        yearRow(2005),
      ]);

      const result = await overviewService('both');

      expect(result).toEqual({
        globalPeriod: {
          publicSlug: 'global',
          startYear: 2000,
          endYear: 2005,
          totalParticipations: 1234,
          totalSchools: 87,
          editionsCount: 4,
          missingYears: [2002, 2004],
          lastPublishedAt: '2025-02-01T10:00:00.000Z',
          topName: { label: 'Ane', count: 100 },
          topSurname: { label: 'Garcia', count: 200 },
          topSchool: { label: 'Ikastola Canonical', count: 300 },
        },
        lastPeriod: {
          publicSlug: '2005',
          year: 2005,
          totalParticipations: 1234,
          totalSchools: 87,
          growthRate: 2.5,
          lastPublishedAt: '2025-02-01T10:00:00.000Z',
          topName: { label: 'Ane', count: 100 },
          topSurname: { label: 'Garcia', count: 200 },
          topSchool: { label: 'Ikastola Canonical', count: 300 },
        },
      });
      expect(getOverviewStatistics).toHaveBeenCalledWith('run-global');
      expect(getOverviewStatistics).toHaveBeenCalledWith('run-2005');
      expect(countRankedSchools).toHaveBeenCalledWith('top-schools-id');
    });
  });

  describe('scope selection', () => {
    it('returns only the global period for scope global', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow, yearRow(2005)]);

      const result = await overviewService('global');

      expect(result.lastPeriod).toBeUndefined();
      expect(result.globalPeriod).toBeDefined();
      expect(getOverviewStatistics).toHaveBeenCalledTimes(1);
      expect(getOverviewStatistics).toHaveBeenCalledWith('run-global');
    });

    it('returns only the last period for scope last', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow, yearRow(2004), yearRow(2005)]);

      const result = await overviewService('last');

      expect(result.globalPeriod).toBeUndefined();
      expect(result.lastPeriod?.publicSlug).toBe('2005');
      expect(getOverviewStatistics).toHaveBeenCalledTimes(1);
      expect(getOverviewStatistics).toHaveBeenCalledWith('run-2005');
    });

    it('works for scope last without any global row', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([yearRow(2024)]);

      const result = await overviewService('last');

      expect(result.globalPeriod).toBeUndefined();
      expect(result.lastPeriod?.year).toBe(2024);
    });
  });

  describe('last period selection', () => {
    it('picks the newest year period and ignores the global one', async () => {
      const lateGlobal = makeOverviewPeriodRow({
        kind: 'global',
        public_slug: 'global',
        published_run_id: 'run-global',
        start_year: 2030,
        end_year: 2030,
      });
      vi.mocked(getPublishedPeriods).mockResolvedValue([
        yearRow(2022),
        yearRow(2024),
        yearRow(2023),
        lateGlobal,
      ]);

      const result = await overviewService('last');

      expect(result.lastPeriod?.year).toBe(2024);
      expect(getOverviewStatistics).toHaveBeenCalledWith('run-2024');
    });
  });

  describe('editionsCount and missingYears', () => {
    it('reports no missing years for contiguous years', async () => {
      const contiguous = makeOverviewPeriodRow({
        kind: 'global',
        public_slug: 'global',
        published_run_id: 'run-global',
        start_year: 2020,
        end_year: 2023,
      });
      vi.mocked(getPublishedPeriods).mockResolvedValue([
        contiguous,
        yearRow(2020),
        yearRow(2021),
        yearRow(2022),
        yearRow(2023),
      ]);

      const result = await overviewService('global');

      expect(result.globalPeriod?.missingYears).toEqual([]);
      expect(result.globalPeriod?.editionsCount).toBe(2023 - 2020 + 1);
    });

    it('counts a single-year range as one edition', async () => {
      const single = makeOverviewPeriodRow({
        kind: 'global',
        public_slug: 'global',
        published_run_id: 'run-global',
        start_year: 2024,
        end_year: 2024,
      });
      vi.mocked(getPublishedPeriods).mockResolvedValue([single, yearRow(2024)]);

      const result = await overviewService('global');

      expect(result.globalPeriod?.editionsCount).toBe(1);
      expect(result.globalPeriod?.missingYears).toEqual([]);
    });
  });

  describe('number conversion', () => {
    it('converts string values coming from the database into numbers', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow, yearRow(2005)]);
      vi.mocked(getOverviewStatistics).mockResolvedValue([
        makeOverviewStatisticRow('totalParticipants', {
          statistic_values: [{ metric_key: 'participant_count', value_numeric: '1234' as never }],
        }),
        makeOverviewStatisticRow('topNames', {
          statistic_ranks: [{ entity_label: 'Ane', value: 100, schools: null }],
        }),
        makeOverviewStatisticRow('topSurnames', {
          statistic_ranks: [{ entity_label: 'Garcia', value: 200, schools: null }],
        }),
        makeOverviewStatisticRow('topSchools', {
          id: 'top-schools-id',
          statistic_ranks: [{ entity_label: 'Raw School', value: '300' as never, schools: null }],
        }),
      ]);

      const result = await overviewService('last');

      expect(result.lastPeriod?.totalParticipations).toBe(1234);
      expect(result.lastPeriod?.topSchool.count).toBe(300);
    });
  });

  describe('growthRate', () => {
    beforeEach(() => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([yearRow(2005)]);
    });

    it('is null when the statistic is absent', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(statisticsWith('participantsGrowthRate'));

      const result = await overviewService('last');

      expect(result.lastPeriod?.growthRate).toBeNull();
    });

    it('is null when the numeric value is null', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(
        statisticsWith(
          'participantsGrowthRate',
          makeOverviewStatisticRow('participantsGrowthRate', {
            statistic_values: [{ metric_key: 'growth_rate', value_numeric: null }],
          }),
        ),
      );

      const result = await overviewService('last');

      expect(result.lastPeriod?.growthRate).toBeNull();
    });

    it('is null when the statistic has no growth_rate metric', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(
        statisticsWith('participantsGrowthRate', makeOverviewStatisticRow('participantsGrowthRate')),
      );

      const result = await overviewService('last');

      expect(result.lastPeriod?.growthRate).toBeNull();
    });
  });

  describe('topSchool label', () => {
    beforeEach(() => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([yearRow(2005)]);
    });

    it('prefers the canonical school name over the entity label', async () => {
      const result = await overviewService('last');

      expect(result.lastPeriod?.topSchool.label).toBe('Ikastola Canonical');
    });

    it('falls back to the entity label without a joined school', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(
        statisticsWith(
          'topSchools',
          makeOverviewStatisticRow('topSchools', {
            id: 'top-schools-id',
            statistic_ranks: [{ entity_label: 'Raw School', value: 300, schools: null }],
          }),
        ),
      );

      const result = await overviewService('last');

      expect(result.lastPeriod?.topSchool).toEqual({ label: 'Raw School', count: 300 });
    });

    it('uses the first rank when there are several', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(
        statisticsWith(
          'topSchools',
          makeOverviewStatisticRow('topSchools', {
            id: 'top-schools-id',
            statistic_ranks: [
              { entity_label: 'First', value: 300, schools: null },
              { entity_label: 'Second', value: 300, schools: null },
            ],
          }),
        ),
      );

      const result = await overviewService('last');

      expect(result.lastPeriod?.topSchool).toEqual({ label: 'First', count: 300 });
    });
  });

  describe('ServerError messages', () => {
    beforeEach(() => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow, yearRow(2005)]);
    });

    it.each(['topSchools', 'totalParticipants', 'topNames', 'topSurnames'])(
      'rejects when the %s statistic is missing',
      async (category) => {
        vi.mocked(getOverviewStatistics).mockResolvedValue(statisticsWith(category));

        await expect(overviewService('global')).rejects.toThrow(
          new ServerError(`The '${category}' statistic is missing in period global`),
        );
      },
    );

    it.each([
      ['has no values', makeOverviewStatisticRow('totalParticipants')],
      [
        'has a null numeric value',
        makeOverviewStatisticRow('totalParticipants', {
          statistic_values: [{ metric_key: 'participant_count', value_numeric: null }],
        }),
      ],
    ])('rejects when totalParticipants %s', async (_title, replacement) => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(statisticsWith('totalParticipants', replacement));

      await expect(overviewService('global')).rejects.toThrow(
        new ServerError("The 'participant_count' metric is missing in period global"),
      );
    });

    it('rejects when topNames has an empty ranking', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(
        statisticsWith('topNames', makeOverviewStatisticRow('topNames', { statistic_ranks: [] })),
      );

      await expect(overviewService('global')).rejects.toThrow(
        new ServerError("The 'topNames' ranking is empty in period global"),
      );
    });

    it('rejects when the first rank has neither a label nor a school', async () => {
      vi.mocked(getOverviewStatistics).mockResolvedValue(
        statisticsWith(
          'topNames',
          makeOverviewStatisticRow('topNames', {
            statistic_ranks: [{ entity_label: null, value: 100, schools: null }],
          }),
        ),
      );

      await expect(overviewService('global')).rejects.toThrow(
        new ServerError("The 'topNames' ranking is empty in period global"),
      );
    });

    it.each([
      ['start_year', { start_year: null }],
      ['end_year', { end_year: null }],
    ])('rejects when the global row has a null %s', async (_field, override) => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([{ ...globalRow, ...override }, yearRow(2005)]);

      await expect(overviewService('global')).rejects.toThrow(
        new ServerError('Period global has no year range'),
      );
    });

    it('rejects when the last year row has no year range', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([
        makeOverviewPeriodRow({ public_slug: '2024', published_run_id: 'run-2024', start_year: null }),
      ]);

      await expect(overviewService('last')).rejects.toThrow(
        new ServerError('Period 2024 has no year range'),
      );
    });

    it('rejects when the global row has no publication date', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([
        { ...globalRow, last_published_at: null },
        yearRow(2005),
      ]);

      await expect(overviewService('global')).rejects.toThrow(
        new ServerError('Period global has no publication date'),
      );
    });
  });

  describe('NotFoundError', () => {
    it('rejects for scope global without a global row', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([yearRow(2024)]);

      await expect(overviewService('global')).rejects.toThrow(
        new NotFoundError('No published global period was found.'),
      );
    });

    it('rejects for scope last without year rows', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow]);

      await expect(overviewService('last')).rejects.toThrow(
        new NotFoundError('No published year period was found.'),
      );
    });

    it('rejects for scope both with an empty period list', async () => {
      vi.mocked(getPublishedPeriods).mockResolvedValue([]);

      await expect(overviewService('both')).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('error propagation', () => {
    it('propagates a getPublishedPeriods rejection unchanged', async () => {
      const error = new Error('periods down');
      vi.mocked(getPublishedPeriods).mockRejectedValue(error);

      await expect(overviewService('both')).rejects.toBe(error);
    });

    it('propagates a getOverviewStatistics rejection unchanged', async () => {
      const error = new Error('statistics down');
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow, yearRow(2005)]);
      vi.mocked(getOverviewStatistics).mockRejectedValue(error);

      await expect(overviewService('both')).rejects.toBe(error);
    });

    it('propagates a countRankedSchools rejection unchanged', async () => {
      const error = new Error('count down');
      vi.mocked(getPublishedPeriods).mockResolvedValue([globalRow, yearRow(2005)]);
      vi.mocked(countRankedSchools).mockRejectedValue(error);

      await expect(overviewService('both')).rejects.toBe(error);
    });
  });
});
