import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getPublishedStatisticByCategory,
  getPublishedStatisticHeaders,
} from '@/app/(backend)/api/statistics/repo/statisticHeaders.repo';
import { NotFoundError, ServerError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeStatisticsHeader } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('getPublishedStatisticHeaders', () => {
  it('returns the headers of the run', async () => {
    const rows = [makeStatisticsHeader()];
    supabase.queueFrom('statistics', ok(rows));

    const result = await getPublishedStatisticHeaders('run-1');

    expect(result).toBe(rows);
  });

  it('filters by run and orders by category then id', async () => {
    supabase.queueFrom('statistics', ok([makeStatisticsHeader()]));

    await getPublishedStatisticHeaders('run-1');

    const query = supabase.lastQuery('statistics');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'order', 'order']);
    expect(supabase.argsOf(query, 'select')).toEqual([['id, category, data_shape, renderer_key, family']]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['run_id', 'run-1']]);
    expect(supabase.argsOf(query, 'order')).toEqual([
      ['category', { ascending: true }],
      ['id', { ascending: true }],
    ]);
  });

  it.each([
    ['an empty list', []],
    ['null data', null],
  ])('rejects with ServerError for %s', async (_title, data) => {
    supabase.queueFrom('statistics', ok(data));

    await expect(getPublishedStatisticHeaders('run-1')).rejects.toThrow(
      new ServerError('No statistic headers were found for the given period.'),
    );
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistics', fail('boom'));

    await expect(getPublishedStatisticHeaders('run-1')).rejects.toThrow(
      new ServerError('Failed to fetch the statistic headers: boom'),
    );
  });
});

describe('getPublishedStatisticByCategory', () => {
  it('returns the header of the category', async () => {
    const row = makeStatisticsHeader();
    supabase.queueFrom('statistics', ok(row));

    const result = await getPublishedStatisticByCategory('run-1', 'topNames');

    expect(result).toBe(row);
  });

  it('filters by run and category with maybeSingle', async () => {
    supabase.queueFrom('statistics', ok(makeStatisticsHeader()));

    await getPublishedStatisticByCategory('run-1', 'topNames');

    const query = supabase.lastQuery('statistics');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'maybeSingle']);
    expect(supabase.argsOf(query, 'eq')).toEqual([
      ['run_id', 'run-1'],
      ['category', 'topNames'],
    ]);
  });

  it('rejects with NotFoundError when the category is absent', async () => {
    supabase.queueFrom('statistics', ok(null));

    await expect(getPublishedStatisticByCategory('run-1', 'topNames')).rejects.toThrow(
      new NotFoundError("No statistic category was found for 'topNames' in the given period."),
    );
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistics', fail('boom'));

    await expect(getPublishedStatisticByCategory('run-1', 'topNames')).rejects.toThrow(
      new ServerError('Failed to fetch the statistic category: boom'),
    );
  });
});
