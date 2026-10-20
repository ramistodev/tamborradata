import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPeriod } from '@/app/(backend)/api/statistics/repo/period.repo';
import { NotFoundError, PeriodMovedError, ServerError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makePublishedPeriodRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

const notFound = new NotFoundError('No published period was found for the given slug.');

describe('getPublishedPeriod', () => {
  describe('published period', () => {
    it('maps the row to the published period', async () => {
      supabase.queueFrom('stats_periods', ok(makePublishedPeriodRow()));

      const result = await getPublishedPeriod('2024');

      expect(result).toEqual({
        runId: 'run-2024',
        kind: 'year',
        metaData: {
          period: '2024',
          periodKind: 'year',
          publishedAt: '2025-02-01T10:00:00.000Z',
          updatedAt: '2025-02-01T10:00:00.000Z',
        },
      });
    });

    it('queries a single row filtering ready and published periods', async () => {
      supabase.queueFrom('stats_periods', ok(makePublishedPeriodRow()));

      await getPublishedPeriod('2024');

      expect(supabase.queries).toHaveLength(1);
      const query = supabase.lastQuery('stats_periods');
      expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'not', 'single']);
      expect(supabase.argsOf(query, 'select')).toEqual([
        ['id, published_run_id, kind, public_slug, last_published_at, updated_at'],
      ]);
      expect(supabase.argsOf(query, 'eq')).toEqual([
        ['public_slug', '2024'],
        ['is_ready', true],
      ]);
      expect(supabase.argsOf(query, 'not')).toEqual([['published_run_id', 'is', null]]);
    });

    it('maps a global row to the global kind', async () => {
      supabase.queueFrom(
        'stats_periods',
        ok(makePublishedPeriodRow({ kind: 'global', public_slug: 'global', published_run_id: 'run-global' })),
      );

      const result = await getPublishedPeriod('global');

      expect(result.kind).toBe('global');
      expect(result.metaData.periodKind).toBe('global');
      expect(result.runId).toBe('run-global');
    });
  });

  describe('slug aliases', () => {
    it('rejects with PeriodMovedError carrying the new slug', async () => {
      supabase.queueFrom('stats_periods', fail('x', 'PGRST116'));
      supabase.queueFrom('stats_period_slug_aliases', ok({ stats_periods: { public_slug: '2024' } }));

      const promise = getPublishedPeriod('2024-old');

      await expect(promise).rejects.toThrow(new PeriodMovedError('2024'));
      await expect(promise).rejects.toMatchObject({ slug: '2024' });
    });

    it('queries the alias table with the requested slug', async () => {
      supabase.queueFrom('stats_periods', fail('x', 'PGRST116'));
      supabase.queueFrom('stats_period_slug_aliases', ok({ stats_periods: { public_slug: '2024' } }));

      await expect(getPublishedPeriod('2024-old')).rejects.toBeInstanceOf(PeriodMovedError);

      expect(supabase.queries).toHaveLength(2);
      const query = supabase.lastQuery('stats_period_slug_aliases');
      expect(supabase.methods(query)).toEqual(['select', 'eq', 'not', 'maybeSingle']);
      expect(supabase.argsOf(query, 'select')).toEqual([['stats_periods!inner(public_slug)']]);
      expect(supabase.argsOf(query, 'eq')).toEqual([['slug', '2024-old']]);
      expect(supabase.argsOf(query, 'not')).toEqual([['stats_periods.published_run_id', 'is', null]]);
    });

    it('normalizes an array relation to its first element', async () => {
      supabase.queueFrom('stats_periods', fail('x', 'PGRST116'));
      supabase.queueFrom('stats_period_slug_aliases', ok({ stats_periods: [{ public_slug: '2024' }] }));

      await expect(getPublishedPeriod('2024-old')).rejects.toThrow(new PeriodMovedError('2024'));
    });

    it('does not redirect to the same slug', async () => {
      supabase.queueFrom('stats_periods', fail('x', 'PGRST116'));
      supabase.queueFrom('stats_period_slug_aliases', ok({ stats_periods: { public_slug: '2024' } }));

      await expect(getPublishedPeriod('2024')).rejects.toThrow(notFound);
    });

    it.each([
      ['no alias row', null],
      ['an empty relation array', { stats_periods: [] }],
      ['an empty target slug', { stats_periods: { public_slug: '' } }],
    ])('rejects with NotFoundError when the alias lookup returns %s', async (_title, aliasData) => {
      supabase.queueFrom('stats_periods', fail('x', 'PGRST116'));
      supabase.queueFrom('stats_period_slug_aliases', ok(aliasData));

      await expect(getPublishedPeriod('missing')).rejects.toThrow(notFound);
    });

    it('rejects with ServerError when the alias query fails', async () => {
      supabase.queueFrom('stats_periods', fail('x', 'PGRST116'));
      supabase.queueFrom('stats_period_slug_aliases', fail('boom'));

      await expect(getPublishedPeriod('missing')).rejects.toThrow(
        new ServerError('Failed to resolve the slug alias: boom'),
      );
    });
  });

  describe('database errors', () => {
    it.each([
      ['no code', fail('boom')],
      ['a non-PGRST116 code', fail('boom', 'XX000')],
    ])('rejects with ServerError and skips the alias lookup for %s', async (_title, failure) => {
      supabase.queueFrom('stats_periods', failure);

      await expect(getPublishedPeriod('2024')).rejects.toThrow(
        new ServerError('Failed to fetch the published period: boom'),
      );
      expect(supabase.queries).toHaveLength(1);
    });
  });

  describe('rows without a published run', () => {
    it.each([
      ['a null published_run_id', makePublishedPeriodRow({ published_run_id: null })],
      ['a null row', null],
    ])('rejects with NotFoundError for %s', async (_title, row) => {
      supabase.queueFrom('stats_periods', ok(row));

      await expect(getPublishedPeriod('2024')).rejects.toThrow(notFound);
    });
  });
});
