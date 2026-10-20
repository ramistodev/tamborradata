import type { OverviewPeriodRow, OverviewStatisticRow } from '@/app/(backend)/api/overview/types';
import type { ParticipantRow } from '@/app/(backend)/api/participants/types';
import type {
  PublishedEditorialSection,
  StatisticRankRaw,
  StatisticSeriesPointRaw,
  StatisticValueRaw,
  StatisticsHeader,
} from '@/app/(backend)/api/statistics/types';
import type { StatisticCategories } from '@/app/types/statistics';

export function makeStatsPeriodRow(
  overrides: Partial<{
    internal_key: string;
    public_slug: string;
    kind: 'year' | 'global';
    last_published_at: string | null;
  }> = {},
) {
  return {
    internal_key: '2024',
    public_slug: '2024',
    kind: 'year' as 'year' | 'global',
    last_published_at: '2025-02-01T10:00:00.000Z' as string | null,
    ...overrides,
  };
}

/** Row of `stats_periods` as read by `statistics/repo/period.repo.ts`. */
export function makePublishedPeriodRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'period-1',
    published_run_id: 'run-2024',
    kind: 'year',
    public_slug: '2024',
    last_published_at: '2025-02-01T10:00:00.000Z',
    updated_at: '2025-02-01T10:00:00.000Z',
    ...overrides,
  };
}

/** Row read by `overview/repo/overview.repo.ts#getPublishedPeriods`. */
export function makeOverviewPeriodRow(overrides: Partial<OverviewPeriodRow> = {}): OverviewPeriodRow {
  return {
    published_run_id: 'run-2024',
    kind: 'year',
    public_slug: '2024',
    start_year: 2024,
    end_year: 2024,
    last_published_at: '2025-02-01T10:00:00.000Z',
    ...overrides,
  };
}

export function makeOverviewStatisticRow(
  category: StatisticCategories,
  overrides: Partial<OverviewStatisticRow> = {},
): OverviewStatisticRow {
  return { id: `stat-${category}`, category, statistic_values: [], statistic_ranks: [], ...overrides };
}

export function makeParticipantRow(overrides: Partial<ParticipantRow> = {}): ParticipantRow {
  return {
    name: 'Ane Garcia Lopez',
    name_key: 'ane garcia lopez',
    year: 2024,
    school: { canonical_name: 'Ikastola Test', school_key: 'ikastola-test' },
    scraped_url: { url: 'https://example.org/2024' },
    resolution: { name_keys: ['ane'], surname_keys: ['garcia', 'lopez'] },
    ...overrides,
  };
}

export function makeStatisticsHeader(overrides: Partial<StatisticsHeader> = {}): StatisticsHeader {
  return {
    id: 'stat-1',
    category: 'topNames',
    data_shape: 'ranks',
    renderer_key: 'horizontalRanking',
    family: 'names',
    ...overrides,
  };
}

export function makeRankRaw(overrides: Partial<StatisticRankRaw> = {}): StatisticRankRaw {
  return {
    id: 'rank-1',
    group_school_id: null,
    entity_type: 'name',
    school_id: null,
    entity_key: 'ane',
    entity_label: 'Ane',
    rank: 1,
    value: 10,
    ...overrides,
  };
}

export function makeValueRaw(
  metric_key: string,
  value_numeric: number | null,
  overrides: Partial<StatisticValueRaw> = {},
): StatisticValueRaw {
  return { metric_key, value_numeric, value_text: null, value_boolean: null, ...overrides };
}

export function makeSeriesPointRaw(overrides: Partial<StatisticSeriesPointRaw> = {}): StatisticSeriesPointRaw {
  return {
    entity_type: 'name',
    school_id: null,
    entity_key: 'ane',
    entity_label: 'Ane',
    metric_key: 'count',
    dimension_key: '2024',
    dimension_order: 2024,
    value: 10,
    ...overrides,
  };
}

export function makePublishedSection(
  overrides: Partial<PublishedEditorialSection> = {},
): PublishedEditorialSection {
  return { id: 'sum-1', section: 'periodIntro', locale: 'es', template: 'Intro text', ...overrides };
}

/** Row read by `statistics/repo/schools.repo.ts` (`select('id, canonical_name, school_key')`) and `schools/repo/schools.repo.ts`. */
export function makeSchoolRow(overrides: Partial<{ id: string; canonical_name: string; school_key: string }> = {}) {
  return { id: 'school-1', canonical_name: 'Ikastola Test', school_key: 'ikastola-test', ...overrides };
}
