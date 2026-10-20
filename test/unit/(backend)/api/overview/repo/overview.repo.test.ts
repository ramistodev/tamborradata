import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  countRankedSchools,
  getOverviewStatistics,
  getPublishedPeriods,
} from '@/app/(backend)/api/overview/repo/overview.repo';
import { ServerError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeOverviewPeriodRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('getPublishedPeriods', () => {
  it('returns the rows from the database', async () => {
    const rows = [makeOverviewPeriodRow()];
    supabase.queueFrom('stats_periods', ok(rows));

    await expect(getPublishedPeriods()).resolves.toBe(rows);
  });

  it('filters ready periods with a published run', async () => {
    supabase.queueFrom('stats_periods', ok([]));

    await getPublishedPeriods();

    const query = supabase.lastQuery('stats_periods');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'not', 'returns']);
    expect(supabase.argsOf(query, 'select')).toEqual([
      ['published_run_id, kind, public_slug, start_year, end_year, last_published_at'],
    ]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['is_ready', true]]);
    expect(supabase.argsOf(query, 'not')).toEqual([['published_run_id', 'is', null]]);
  });

  it('returns an empty list for null data', async () => {
    supabase.queueFrom('stats_periods', ok(null));

    await expect(getPublishedPeriods()).resolves.toEqual([]);
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('stats_periods', fail('boom'));

    await expect(getPublishedPeriods()).rejects.toThrow(
      new ServerError('Failed to fetch the published periods: boom'),
    );
  });
});

describe('getOverviewStatistics', () => {
  it('returns the rows from the database', async () => {
    const rows = [{ id: 's1', category: 'topNames', statistic_values: [], statistic_ranks: [] }];
    supabase.queueFrom('statistics', ok(rows));

    await expect(getOverviewStatistics('run-1')).resolves.toBe(rows);
  });

  it('selects the overview categories with their top-ranked, non school-grouped ranks', async () => {
    supabase.queueFrom('statistics', ok([]));

    await getOverviewStatistics('run-1');

    const query = supabase.lastQuery('statistics');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'in', 'eq', 'is', 'returns']);
    expect(String(supabase.argsOf(query, 'select')[0][0]).replace(/\s+/g, ' ')).toBe(
      'id, category, statistic_values(metric_key, value_numeric), statistic_ranks(entity_label, value, schools!statistic_ranks_school_id_fkey(canonical_name))',
    );
    expect(supabase.argsOf(query, 'eq')).toEqual([
      ['run_id', 'run-1'],
      ['statistic_ranks.rank', 1],
    ]);
    expect(supabase.argsOf(query, 'in')).toEqual([
      [
        'category',
        ['totalParticipants', 'participantsGrowthRate', 'topNames', 'topSurnames', 'topSchools'],
      ],
    ]);
    expect(supabase.argsOf(query, 'is')).toEqual([['statistic_ranks.group_school_id', null]]);
  });

  it('returns an empty list for null data', async () => {
    supabase.queueFrom('statistics', ok(null));

    await expect(getOverviewStatistics('run-1')).resolves.toEqual([]);
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistics', fail('boom'));

    await expect(getOverviewStatistics('run-1')).rejects.toThrow(
      new ServerError('Failed to fetch the overview statistics: boom'),
    );
  });
});

describe('countRankedSchools', () => {
  it('counts the non school-grouped ranks of the statistic without fetching rows', async () => {
    supabase.queueFrom('statistic_ranks', ok(null, 87));

    const result = await countRankedSchools('top-id');

    expect(result).toBe(87);
    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'is']);
    expect(supabase.argsOf(query, 'select')).toEqual([['id', { count: 'exact', head: true }]]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['statistic_id', 'top-id']]);
    expect(supabase.argsOf(query, 'is')).toEqual([['group_school_id', null]]);
  });

  it.each([
    ['an undefined count', ok(null)],
    ['a null count', ok(null, null)],
  ])('returns 0 for %s', async (_title, result) => {
    supabase.queueFrom('statistic_ranks', result);

    await expect(countRankedSchools('top-id')).resolves.toBe(0);
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_ranks', fail('boom'));

    await expect(countRankedSchools('top-id')).rejects.toThrow(
      new ServerError('Failed to count the ranked schools: boom'),
    );
  });
});
