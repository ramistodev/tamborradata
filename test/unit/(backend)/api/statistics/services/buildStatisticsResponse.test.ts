import { describe, expect, it, vi } from 'vitest';
import {
  buildStatisticsResponse,
  resolveEditorialTemplates,
  selectOverviewStatistics,
} from '@/app/(backend)/api/statistics/services/buildStatisticsResponse';
import type { AllSchoolsById } from '@/app/(backend)/api/statistics/types';
import { logMock } from '@/test/helpers/loggerMock';
import {
  makePublishedSection,
  makeRankRaw,
  makeSeriesPointRaw,
  makeStatisticsHeader,
  makeValueRaw,
} from '@/test/fixtures/dbRows';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());

const schools: AllSchoolsById = new Map([
  ['s1', { schoolId: 's1', canonicalName: 'Escuela Uno', schoolKey: 'uno' }],
]);

const valuesHeader = (overrides: Parameters<typeof makeStatisticsHeader>[0] = {}) =>
  makeStatisticsHeader({
    id: 'v1',
    category: 'totalParticipants',
    data_shape: 'values',
    renderer_key: 'metricCard',
    family: 'participationDynamics',
    ...overrides,
  });

describe('selectOverviewStatistics', () => {
  it('keeps only values-shaped categories listed in overviewMetrics, preserving order', () => {
    const total = valuesHeader({ id: 'a' });
    const growthValues = valuesHeader({ id: 'b', category: 'participantsGrowthRate' });
    const growthSeries = makeStatisticsHeader({
      id: 'c',
      category: 'participantsGrowthRate',
      data_shape: 'series',
      renderer_key: 'lineChart',
      family: 'participationDynamics',
    });
    const topNames = makeStatisticsHeader({ id: 'd', category: 'topNames' });
    const averageNameLength = valuesHeader({ id: 'e', category: 'averageNameLength', family: 'names' });

    const result = selectOverviewStatistics([total, growthValues, growthSeries, topNames, averageNameLength]);

    expect(result).toEqual([total, growthValues]);
  });
});

describe('resolveEditorialTemplates', () => {
  it('resolves school placeholders using the schools map', () => {
    const result = resolveEditorialTemplates(
      [makePublishedSection({ section: 'periodIntro', template: 'Top: {{school:s1}}' })],
      schools,
    );

    expect(result).toEqual([{ section: 'periodIntro', summary: 'Top: Escuela Uno' }]);
  });

  it('drops only the summary with an unresolvable token and logs it', () => {
    const result = resolveEditorialTemplates(
      [
        makePublishedSection({ id: 'bad', section: 'periodIntro', template: 'Bad {{school:zz}}', locale: 'es' }),
        makePublishedSection({ id: 'good', section: 'periodOutro', template: 'Fine' }),
      ],
      schools,
    );

    expect(result).toEqual([{ section: 'periodOutro', summary: 'Fine' }]);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock).toHaveBeenCalledWith(
      "[statistics] Summary 'periodIntro' (es) skipped: Failed to resolve school ID: zz",
      'error',
    );
  });

  it('returns an empty list for empty input', () => {
    expect(resolveEditorialTemplates([], schools)).toEqual([]);
  });
});

describe('buildStatisticsResponse', () => {
  const meta = makeStatisticsMeta();

  describe('intro and outro', () => {
    it('come from the periodIntro and periodOutro summaries', () => {
      const result = buildStatisticsResponse(
        meta,
        [
          makePublishedSection({ section: 'periodIntro', template: 'Intro' }),
          makePublishedSection({ id: 'o', section: 'periodOutro', template: 'Outro' }),
        ],
        [],
        [],
        schools,
      );

      expect(result.intro).toEqual({ section: 'periodIntro', summary: 'Intro' });
      expect(result.outro).toEqual({ section: 'periodOutro', summary: 'Outro' });
    });

    it('default to empty summaries when absent', () => {
      const result = buildStatisticsResponse(meta, [], [], [], schools);

      expect(result.intro).toEqual({ section: 'periodIntro', summary: '' });
      expect(result.outro).toEqual({ section: 'periodOutro', summary: '' });
      expect(result.metaData).toBe(meta);
    });
  });

  describe('families', () => {
    it('are sorted by name and take the template of the matching section', () => {
      const result = buildStatisticsResponse(
        meta,
        [makePublishedSection({ section: 'schools', template: 'Schools text' })],
        [
          { statistic: makeStatisticsHeader({ id: 'r1', family: 'schools', category: 'topSchools' }), data: { items: [], nextCursor: null } },
          { statistic: makeStatisticsHeader({ id: 'r2' }), data: { items: [], nextCursor: null } },
        ],
        [],
        schools,
      );

      expect(result.families.map((family) => family.family)).toEqual(['names', 'schools']);
      expect(result.families[0].template).toEqual({ section: 'names', summary: '' });
      expect(result.families[1].template).toEqual({ section: 'schools', summary: 'Schools text' });
    });

    it('group several statistics of one family in input order', () => {
      const result = buildStatisticsResponse(
        meta,
        [],
        [
          { statistic: makeStatisticsHeader({ id: 'r1', category: 'topNames' }), data: { items: [], nextCursor: null } },
          { statistic: makeStatisticsHeader({ id: 'r2', category: 'newNames' }), data: { items: [], nextCursor: null } },
        ],
        [],
        schools,
      );

      expect(result.families).toHaveLength(1);
      expect(result.families[0].categories.map((category) => category.category)).toEqual([
        'topNames',
        'newNames',
      ]);
    });
  });

  describe('category data shapes', () => {
    it('adds pageInfo to ranks categories only', () => {
      const result = buildStatisticsResponse(
        meta,
        [],
        [
          {
            statistic: makeStatisticsHeader({ id: 'r1' }),
            data: { items: [makeRankRaw()], nextCursor: 'next' },
          },
          { statistic: valuesHeader(), data: [makeValueRaw('participant_count', 5)] },
          {
            statistic: makeStatisticsHeader({
              id: 'x1',
              category: 'nameTrends',
              data_shape: 'series',
              renderer_key: 'lineChart',
              family: 'names',
            }),
            data: [makeSeriesPointRaw()],
          },
        ],
        [],
        schools,
      );

      const byCategory = Object.fromEntries(
        result.families.flatMap((family) => family.categories).map((category) => [category.category, category]),
      );
      expect(byCategory.topNames).toHaveProperty('pageInfo', { nextCursor: 'next' });
      expect(byCategory.totalParticipants).not.toHaveProperty('pageInfo');
      expect(byCategory.nameTrends).not.toHaveProperty('pageInfo');
    });

    it('throws on an unsupported data shape', () => {
      expect(() =>
        buildStatisticsResponse(
          meta,
          [],
          [{ statistic: makeStatisticsHeader({ data_shape: 'weird' as never }), data: [] }],
          [],
          schools,
        ),
      ).toThrow(new Error('Unsupported statistic data shape: weird'));
    });
  });

  describe('overview', () => {
    it('keeps only the metric keys allowed for the category', () => {
      const statistic = valuesHeader({
        id: 'd1',
        category: 'namesDiversity',
        family: 'identityDiversity',
      });

      const result = buildStatisticsResponse(
        meta,
        [],
        [],
        [
          {
            statistic,
            data: [
              makeValueRaw('distinct_count', 200),
              makeValueRaw('diversity_percentage', 12.5),
              makeValueRaw('extra_metric', 1),
            ],
          },
        ],
        schools,
      );

      expect(result.overview).toEqual([
        { category: 'namesDiversity', metricKey: 'distinct_count', valueNumeric: 200 },
        { category: 'namesDiversity', metricKey: 'diversity_percentage', valueNumeric: 12.5 },
      ]);
    });

    it('omits null numeric values from the overview items', () => {
      const result = buildStatisticsResponse(
        meta,
        [],
        [],
        [{ statistic: valuesHeader(), data: [makeValueRaw('participant_count', null)] }],
        schools,
      );

      expect(result.overview).toStrictEqual([{ category: 'totalParticipants', metricKey: 'participant_count' }]);
    });
  });
});
