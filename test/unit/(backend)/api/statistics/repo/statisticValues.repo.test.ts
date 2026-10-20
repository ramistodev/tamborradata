import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllStatisticValues } from '@/app/(backend)/api/statistics/repo/statisticValues.repo';
import { ServerError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeValueRaw } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('getAllStatisticValues', () => {
  it('returns the rows from the database', async () => {
    const rows = [makeValueRaw('participant_count', 10)];
    supabase.queueFrom('statistic_values', ok(rows));

    await expect(getAllStatisticValues('stat-1')).resolves.toBe(rows);
  });

  it('filters by statistic and orders by metric key then id', async () => {
    supabase.queueFrom('statistic_values', ok([]));

    await getAllStatisticValues('stat-1');

    const query = supabase.lastQuery('statistic_values');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'order', 'order']);
    expect(supabase.argsOf(query, 'select')).toEqual([
      ['metric_key, value_numeric, value_text, value_boolean'],
    ]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['statistic_id', 'stat-1']]);
    expect(supabase.argsOf(query, 'order')).toEqual([
      ['metric_key', { ascending: true }],
      ['id', { ascending: true }],
    ]);
  });

  it('returns an empty list for null data', async () => {
    supabase.queueFrom('statistic_values', ok(null));

    await expect(getAllStatisticValues('stat-1')).resolves.toEqual([]);
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_values', fail('boom'));

    await expect(getAllStatisticValues('stat-1')).rejects.toThrow(
      new ServerError('Failed to fetch the statistic values: boom'),
    );
  });
});
