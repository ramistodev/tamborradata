import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllPublishedPeriods } from '@/app/(backend)/api/period/repo/period.repo';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeStatsPeriodRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('getAllPublishedPeriods', () => {
  it('returns the rows from the database', async () => {
    const rows = [makeStatsPeriodRow(), makeStatsPeriodRow({ internal_key: '2023', public_slug: '2023' })];
    supabase.queueFrom('stats_periods', ok(rows));

    const result = await getAllPublishedPeriods();

    expect(result).toBe(rows);
  });

  it('builds the query on stats_periods filtering ready and published periods', async () => {
    supabase.queueFrom('stats_periods', ok([]));

    await getAllPublishedPeriods();

    expect(supabase.queries).toHaveLength(1);
    const query = supabase.lastQuery('stats_periods');
    expect(query.kind).toBe('from');
    expect(supabase.methods(query)).toEqual(['select', 'order', 'eq', 'not']);
    expect(supabase.argsOf(query, 'select')).toEqual([['internal_key, public_slug, kind, last_published_at']]);
    expect(supabase.argsOf(query, 'order')).toEqual([['public_slug', { ascending: false }]]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['is_ready', true]]);
    expect(supabase.argsOf(query, 'not')).toEqual([['published_run_id', 'is', null]]);
  });

  it('rejects with a plain Error carrying the database message', async () => {
    supabase.queueFrom('stats_periods', fail('boom'));

    await expect(getAllPublishedPeriods()).rejects.toThrow(new Error('boom'));
  });
});
