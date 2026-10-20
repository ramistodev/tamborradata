import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getStatisticSeriesPage,
  getStatisticSeriesPreview,
} from '@/app/(backend)/api/statistics/repo/statisticSeries.repo';
import { decodeSeriesCursor, encodeSeriesCursor } from '@/app/(backend)/lib/encript';
import { ServerError, ValidationError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeSeriesPointRaw } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

const invalidForCategory = new ValidationError("The 'cursor' parameter is not valid for this category");

const pointsOf = (entityKey: string | null, count = 2) =>
  Array.from({ length: count }, (_, i) =>
    makeSeriesPointRaw({
      entity_key: entityKey,
      dimension_key: String(2020 + i),
      dimension_order: 2020 + i,
    }),
  );

describe('getStatisticSeriesPreview', () => {
  it('calls the top series rpc with the preview limits', async () => {
    const data = [makeSeriesPointRaw()];
    supabase.queueRpc('get_top_statistic_series', ok(data));

    const result = await getStatisticSeriesPreview('stat-1');

    expect(result).toBe(data);
    expect(supabase.queries).toHaveLength(1);
    const query = supabase.lastQuery();
    expect(query.kind).toBe('rpc');
    expect(query.target).toBe('get_top_statistic_series');
    expect(query.rpcArgs).toEqual({ p_statistic_id: 'stat-1', p_limit: 10, p_periods: 10, p_school_limit: 10 });
  });

  it('returns an empty list for null data', async () => {
    supabase.queueRpc('get_top_statistic_series', ok(null));

    await expect(getStatisticSeriesPreview('stat-1')).resolves.toEqual([]);
  });

  it('rejects with ServerError on a rpc error', async () => {
    supabase.queueRpc('get_top_statistic_series', fail('boom'));

    await expect(getStatisticSeriesPreview('stat-1')).rejects.toThrow(
      new ServerError('Failed to fetch the statistic series preview: boom'),
    );
  });
});

describe('getStatisticSeriesPage', () => {
  describe('entity type peek', () => {
    it('inspects a single row of the series table', async () => {
      supabase.queueFrom('statistic_series', ok(null), ok([]));

      await getStatisticSeriesPage('stat-1', { limit: 2 });

      const peek = supabase.queriesFor('statistic_series')[0];
      expect(supabase.methods(peek)).toEqual(['select', 'eq', 'limit', 'maybeSingle']);
      expect(supabase.argsOf(peek, 'select')).toEqual([['entity_type']]);
      expect(supabase.argsOf(peek, 'eq')).toEqual([['statistic_id', 'stat-1']]);
      expect(supabase.argsOf(peek, 'limit')).toEqual([[1]]);
    });

    it('rejects with ServerError when the peek fails', async () => {
      supabase.queueFrom('statistic_series', fail('boom'));

      await expect(getStatisticSeriesPage('stat-1', { limit: 2 })).rejects.toThrow(
        new ServerError('Failed to inspect the statistic series entity type: boom'),
      );
    });
  });

  describe.each(['name', 'surname'])('entity keyed series (%s)', (entityType) => {
    beforeEach(() => {
      supabase.queueFrom('statistic_series', ok({ entity_type: entityType }));
    });

    it('asks the rpc for one extra entity and starts from the beginning', async () => {
      supabase.queueRpc('get_statistic_series_entity_page', ok([]));

      await getStatisticSeriesPage('stat-1', { limit: 2 });

      const query = supabase.lastQuery('get_statistic_series_entity_page');
      expect(query.kind).toBe('rpc');
      expect(query.rpcArgs).toEqual({ p_statistic_id: 'stat-1', p_limit: 3, p_after_entity_key: null });
    });

    it('returns the points of the page entities and a cursor for the next one', async () => {
      supabase.queueRpc(
        'get_statistic_series_entity_page',
        ok([...pointsOf('a'), ...pointsOf('b'), ...pointsOf('c')]),
      );

      const result = await getStatisticSeriesPage('stat-1', { limit: 2 });

      expect(result.items).toEqual([...pointsOf('a'), ...pointsOf('b')]);
      expect(decodeSeriesCursor(result.nextCursor as string)).toEqual({
        version: 1,
        statisticId: 'stat-1',
        lastEntityKey: 'b',
      });
    });

    it('has no next cursor when there is no extra entity', async () => {
      supabase.queueRpc('get_statistic_series_entity_page', ok([...pointsOf('a'), ...pointsOf('b')]));

      const result = await getStatisticSeriesPage('stat-1', { limit: 2 });

      expect(result.items).toHaveLength(4);
      expect(result.nextCursor).toBeNull();
    });

    it('drops points without an entity key', async () => {
      supabase.queueRpc(
        'get_statistic_series_entity_page',
        ok([...pointsOf('a'), ...pointsOf(null, 1), ...pointsOf('b')]),
      );

      const result = await getStatisticSeriesPage('stat-1', { limit: 2 });

      expect(result.items).toEqual([...pointsOf('a'), ...pointsOf('b')]);
    });

    it('returns an empty page for null data', async () => {
      supabase.queueRpc('get_statistic_series_entity_page', ok(null));

      await expect(getStatisticSeriesPage('stat-1', { limit: 2 })).resolves.toEqual({
        items: [],
        nextCursor: null,
      });
    });

    it('continues after the entity of the cursor', async () => {
      supabase.queueRpc('get_statistic_series_entity_page', ok([]));
      const cursor = encodeSeriesCursor({ version: 1, statisticId: 'stat-1', lastEntityKey: 'b' });

      await getStatisticSeriesPage('stat-1', { limit: 2, cursor });

      expect(supabase.lastQuery('get_statistic_series_entity_page').rpcArgs).toEqual({
        p_statistic_id: 'stat-1',
        p_limit: 3,
        p_after_entity_key: 'b',
      });
    });

    it('rejects a cursor of another statistic without calling the rpc', async () => {
      const cursor = encodeSeriesCursor({ version: 1, statisticId: 'other', lastEntityKey: 'b' });

      await expect(getStatisticSeriesPage('stat-1', { limit: 2, cursor })).rejects.toThrow(invalidForCategory);
      expect(supabase.queriesFor('get_statistic_series_entity_page')).toHaveLength(0);
    });

    it('rejects a garbage cursor', async () => {
      await expect(getStatisticSeriesPage('stat-1', { limit: 2, cursor: 'not-a-token' })).rejects.toThrow(
        new ValidationError("The 'cursor' parameter is not valid"),
      );
    });

    it('rejects with ServerError on a rpc error', async () => {
      supabase.queueRpc('get_statistic_series_entity_page', fail('boom'));

      await expect(getStatisticSeriesPage('stat-1', { limit: 2 })).rejects.toThrow(
        new ServerError('Failed to fetch the statistic series entity page: boom'),
      );
    });
  });

  describe.each([
    ['school', ok({ entity_type: 'school' })],
    ['no row', ok(null)],
    ['an unknown type', ok({ entity_type: 'xyz' })],
  ])('bounded series (%s)', (_title, peekResult) => {
    beforeEach(() => {
      supabase.queueFrom('statistic_series', peekResult);
    });

    it('returns the whole ordered series without a cursor', async () => {
      const data = [makeSeriesPointRaw(), makeSeriesPointRaw({ dimension_key: '2023' })];
      supabase.queueFrom('statistic_series', ok(data));

      const result = await getStatisticSeriesPage('stat-1', { limit: 2 });

      expect(result).toEqual({ items: data, nextCursor: null });
      const full = supabase.queriesFor('statistic_series')[1];
      expect(supabase.methods(full)).toEqual(['select', 'eq', 'order', 'order', 'order']);
      expect(supabase.argsOf(full, 'select')).toEqual([
        ['entity_type, school_id, entity_key, entity_label, metric_key, dimension_key, dimension_order, value'],
      ]);
      expect(supabase.argsOf(full, 'eq')).toEqual([['statistic_id', 'stat-1']]);
      expect(supabase.argsOf(full, 'order')).toEqual([
        ['dimension_order', { ascending: true }],
        ['dimension_key', { ascending: true }],
        ['id', { ascending: true }],
      ]);
    });

    it('returns an empty list for null data', async () => {
      supabase.queueFrom('statistic_series', ok(null));

      await expect(getStatisticSeriesPage('stat-1', { limit: 2 })).resolves.toEqual({
        items: [],
        nextCursor: null,
      });
    });

    it('rejects any cursor and only runs the peek query', async () => {
      const cursor = encodeSeriesCursor({ version: 1, statisticId: 'stat-1', lastEntityKey: 'b' });

      await expect(getStatisticSeriesPage('stat-1', { limit: 2, cursor })).rejects.toThrow(invalidForCategory);
      expect(supabase.queries).toHaveLength(1);
    });

    it('rejects with ServerError when the full series query fails', async () => {
      supabase.queueFrom('statistic_series', fail('boom'));

      await expect(getStatisticSeriesPage('stat-1', { limit: 2 })).rejects.toThrow(
        new ServerError('Failed to fetch the full statistic series: boom'),
      );
    });
  });
});
