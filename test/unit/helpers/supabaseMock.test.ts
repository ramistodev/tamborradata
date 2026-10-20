import { beforeEach, describe, expect, it } from 'vitest';
import { createSupabaseMock, fail, ok, type SupabaseMock } from '@/test/helpers/supabaseMock';

describe('SupabaseMock', () => {
  let mock: SupabaseMock;

  beforeEach(() => {
    mock = createSupabaseMock();
  });

  it('records chained methods and arguments', async () => {
    mock.queueFrom('stats_periods', ok([{ id: 1 }]));

    const result = await mock.client.from('stats_periods').select('id').eq('slug', 'x').single();
    const query = mock.lastQuery('stats_periods');

    expect(result).toEqual({ data: [{ id: 1 }], error: null });
    expect(mock.methods(query)).toEqual(['select', 'eq', 'single']);
    expect(mock.argsOf(query, 'eq')).toEqual([['slug', 'x']]);
    expect(query.kind).toBe('from');
    expect(query.target).toBe('stats_periods');
  });

  it('returns error results without changing their shape', async () => {
    mock.queueFrom('stats_periods', fail('x', 'PGRST116'));

    const result = await mock.client.from('stats_periods');

    expect(result.error).toEqual({ message: 'x', code: 'PGRST116' });
    expect(result.data).toBeNull();
    expect(fail('m')).toStrictEqual({ data: null, error: { message: 'm' } });
  });

  it('includes count only when supplied to ok', () => {
    expect(ok([])).toStrictEqual({ data: [], error: null });
    expect(ok([], 3)).toStrictEqual({ data: [], error: null, count: 3 });
  });

  it('consumes queued results FIFO and independently per target', async () => {
    mock.queueFrom('first', ok('a'), ok('b'));
    mock.queueFrom('second', ok('c'));

    await expect(mock.client.from('first')).resolves.toEqual(ok('a'));
    await expect(mock.client.from('second')).resolves.toEqual(ok('c'));
    await expect(mock.client.from('first')).resolves.toEqual(ok('b'));
  });

  it('consumes one result each time the same chain is awaited', async () => {
    mock.queueFrom('t', ok('a'), ok('b'));
    const chain = mock.client.from('t').select('*');

    await expect(chain).resolves.toEqual(ok('a'));
    await expect(chain).resolves.toEqual(ok('b'));
  });

  it('rejects loudly when no result is queued', async () => {
    const result = (async () => await mock.client.from('t').select('*'))();

    await expect(result).rejects.toThrow('[supabaseMock] Unexpected from "t": no result queued.');
    await expect(result).rejects.toThrow('Queries so far: [from:t]');
  });

  it('records rpc calls and rejects an unqueued rpc', async () => {
    mock.queueRpc('get_top_statistic_series', ok([]));

    await mock.client.rpc('get_top_statistic_series', { p_limit: 1 });
    const query = mock.lastQuery();

    expect(query.kind).toBe('rpc');
    expect(query.target).toBe('get_top_statistic_series');
    expect(query.rpcArgs).toEqual({ p_limit: 1 });
    await expect(mock.client.rpc('missing_rpc')).rejects.toThrow('Unexpected rpc "missing_rpc"');
  });

  it('records any method name and tracks whether the query was awaited', async () => {
    mock.queueFrom('t', ok(null));
    const chain = mock.client.from('t').foo('x').bar();
    const query = mock.lastQuery();

    expect(mock.methods(query)).toEqual(['foo', 'bar']);
    expect(query.awaited).toBe(false);

    await chain;

    expect(query.awaited).toBe(true);
  });

  it('reports pending results and reset clears all state', async () => {
    mock.queueFrom('t', ok('a'), ok('b'));
    await mock.client.from('t');

    expect(mock.pending()).toEqual(['from:t (1 left)']);
    expect(() => mock.assertNoPending()).toThrow('Unconsumed results: from:t (1 left)');

    mock.reset();

    expect(mock.pending()).toEqual([]);
    expect(mock.queries).toEqual([]);
    expect(() => mock.assertNoPending()).not.toThrow();
  });

  it('throws when no matching last query exists and filters queries by target', () => {
    expect(() => mock.lastQuery()).toThrow('[supabaseMock] No query recorded');
    expect(() => mock.lastQuery('x')).toThrow('[supabaseMock] No query recorded for "x"');

    mock.client.from('x');
    mock.client.from('y');
    mock.client.rpc('x');

    expect(mock.queriesFor('x')).toHaveLength(2);
    expect(mock.queriesFor('y')).toHaveLength(1);
  });
});
