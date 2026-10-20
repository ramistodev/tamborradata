import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSchoolGroupedRanksPage,
  getSchoolGroupedRanksPreview,
  getStatisticRanksPage,
  getStatisticRanksPreview,
} from '@/app/(backend)/api/statistics/repo/statisticRanks.repo';
import { decodeRankCursor, encodeRankCursor } from '@/app/(backend)/lib/encript';
import { ServerError, ValidationError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeRankRaw } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

const COLUMNS = 'id, group_school_id, entity_type, school_id, entity_key, entity_label, rank, value';

const rows = (n: number, extra?: Parameters<typeof makeRankRaw>[0]) =>
  Array.from({ length: n }, (_, i) =>
    makeRankRaw({ id: `r${i + 1}`, rank: i + 1, group_school_id: `g${i + 1}`, ...extra }),
  );

const invalidForCategory = new ValidationError("The 'cursor' parameter is not valid for this category");

describe('getStatisticRanksPreview', () => {
  it('queries the first ranks ordered by rank then id with one extra row', async () => {
    supabase.queueFrom('statistic_ranks', ok(rows(3)));

    await getStatisticRanksPreview('stat-1');

    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'order', 'order', 'limit']);
    expect(supabase.argsOf(query, 'select')).toEqual([[COLUMNS]]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['statistic_id', 'stat-1']]);
    expect(supabase.argsOf(query, 'order')).toEqual([
      ['rank', { ascending: true }],
      ['id', { ascending: true }],
    ]);
    expect(supabase.argsOf(query, 'limit')).toEqual([[11]]);
  });

  it('returns the first ten rows and a cursor when an eleventh row exists', async () => {
    const data = rows(11);
    supabase.queueFrom('statistic_ranks', ok(data));

    const result = await getStatisticRanksPreview('stat-1');

    expect(result.items).toEqual(data.slice(0, 10));
    expect(decodeRankCursor(result.nextCursor as string)).toEqual({
      version: 1,
      statisticId: 'stat-1',
      variant: 'global-rank',
      lastId: 'r10',
      rank: 10,
    });
  });

  it('has no next cursor with exactly ten rows', async () => {
    supabase.queueFrom('statistic_ranks', ok(rows(10)));

    const result = await getStatisticRanksPreview('stat-1');

    expect(result.items).toHaveLength(10);
    expect(result.nextCursor).toBeNull();
  });

  it('returns an empty page for null data', async () => {
    supabase.queueFrom('statistic_ranks', ok(null));

    await expect(getStatisticRanksPreview('stat-1')).resolves.toEqual({ items: [], nextCursor: null });
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_ranks', fail('boom'));

    await expect(getStatisticRanksPreview('stat-1')).rejects.toThrow(
      new ServerError('Failed to fetch the statistic ranks preview: boom'),
    );
  });
});

describe('getStatisticRanksPage', () => {
  it('requests limit plus one row without a keyset filter when there is no cursor', async () => {
    supabase.queueFrom('statistic_ranks', ok([]));

    await getStatisticRanksPage('stat-1', { limit: 5 });

    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'order', 'order', 'limit']);
    expect(supabase.argsOf(query, 'select')).toEqual([[COLUMNS]]);
    expect(supabase.argsOf(query, 'eq')).toEqual([['statistic_id', 'stat-1']]);
    expect(supabase.argsOf(query, 'order')).toEqual([
      ['rank', { ascending: true }],
      ['id', { ascending: true }],
    ]);
    expect(supabase.argsOf(query, 'limit')).toEqual([[6]]);
  });

  it('returns the page items and a cursor built from the last delivered row', async () => {
    const data = rows(6);
    supabase.queueFrom('statistic_ranks', ok(data));

    const result = await getStatisticRanksPage('stat-1', { limit: 5 });

    expect(result.items).toEqual(data.slice(0, 5));
    expect(decodeRankCursor(result.nextCursor as string)).toEqual({
      version: 1,
      statisticId: 'stat-1',
      variant: 'global-rank',
      lastId: 'r5',
      rank: 5,
    });
  });

  it('adds the (rank, id) keyset filter for a valid cursor', async () => {
    supabase.queueFrom('statistic_ranks', ok([]));
    const cursor = encodeRankCursor({
      version: 1,
      variant: 'global-rank',
      statisticId: 'stat-1',
      lastId: 'L',
      rank: 5,
    });

    await getStatisticRanksPage('stat-1', { limit: 5, cursor });

    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'order', 'order', 'limit', 'or']);
    expect(supabase.argsOf(query, 'or')).toEqual([['rank.gt.5,and(rank.eq.5,id.gt.L)']]);
  });

  it.each([
    [
      'another statistic',
      () =>
        encodeRankCursor({
          version: 1,
          variant: 'global-rank',
          statisticId: 'other',
          lastId: 'L',
          rank: 5,
        }),
    ],
    [
      'a school-grouped cursor',
      () =>
        encodeRankCursor({
          version: 1,
          variant: 'school-grouped-rank',
          statisticId: 'stat-1',
          groupSchoolId: 'g1',
        }),
    ],
  ])('rejects a cursor from %s', async (_title, makeCursor) => {
    await expect(getStatisticRanksPage('stat-1', { limit: 5, cursor: makeCursor() })).rejects.toThrow(
      invalidForCategory,
    );
  });

  it('rejects a garbage cursor', async () => {
    await expect(getStatisticRanksPage('stat-1', { limit: 5, cursor: 'not-a-token' })).rejects.toThrow(
      new ValidationError("The 'cursor' parameter is not valid"),
    );
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_ranks', fail('boom'));

    await expect(getStatisticRanksPage('stat-1', { limit: 5 })).rejects.toThrow(
      new ServerError('Failed to fetch the statistic ranks page: boom'),
    );
  });
});

describe('getSchoolGroupedRanksPreview', () => {
  it('queries the first-place rank of each school ordered by school id', async () => {
    supabase.queueFrom('statistic_ranks', ok([]));

    await getSchoolGroupedRanksPreview('stat-1');

    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'not', 'order', 'limit']);
    expect(supabase.argsOf(query, 'select')).toEqual([[COLUMNS]]);
    expect(supabase.argsOf(query, 'eq')).toEqual([
      ['statistic_id', 'stat-1'],
      ['rank', 1],
    ]);
    expect(supabase.argsOf(query, 'not')).toEqual([['group_school_id', 'is', null]]);
    expect(supabase.argsOf(query, 'order')).toEqual([['group_school_id', { ascending: true }]]);
    expect(supabase.argsOf(query, 'limit')).toEqual([[11]]);
  });

  it('returns the first ten rows and a school-grouped cursor when an eleventh row exists', async () => {
    const data = rows(11);
    supabase.queueFrom('statistic_ranks', ok(data));

    const result = await getSchoolGroupedRanksPreview('stat-1');

    expect(result.items).toEqual(data.slice(0, 10));
    expect(decodeRankCursor(result.nextCursor as string)).toEqual({
      version: 1,
      statisticId: 'stat-1',
      variant: 'school-grouped-rank',
      groupSchoolId: 'g10',
    });
  });

  it('rejects when the last delivered row has no group school', async () => {
    const data = rows(11);
    data[9] = makeRankRaw({ id: 'r10', rank: 10, group_school_id: null });
    supabase.queueFrom('statistic_ranks', ok(data));

    await expect(getSchoolGroupedRanksPreview('stat-1')).rejects.toThrow(
      new ServerError('Failed to create the school-grouped ranks cursor'),
    );
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_ranks', fail('boom'));

    await expect(getSchoolGroupedRanksPreview('stat-1')).rejects.toThrow(
      new ServerError('Failed to fetch the school-grouped ranks preview: boom'),
    );
  });
});

describe('getSchoolGroupedRanksPage', () => {
  it('requests limit plus one row without a school filter when there is no cursor', async () => {
    supabase.queueFrom('statistic_ranks', ok([]));

    await getSchoolGroupedRanksPage('stat-1', { limit: 5 });

    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'not', 'order', 'limit']);
    expect(supabase.argsOf(query, 'limit')).toEqual([[6]]);
  });

  it('continues after the school of the cursor', async () => {
    supabase.queueFrom('statistic_ranks', ok([]));
    const cursor = encodeRankCursor({
      version: 1,
      variant: 'school-grouped-rank',
      statisticId: 'stat-1',
      groupSchoolId: 'g9',
    });

    await getSchoolGroupedRanksPage('stat-1', { limit: 5, cursor });

    const query = supabase.lastQuery('statistic_ranks');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'not', 'order', 'limit', 'gt']);
    expect(supabase.argsOf(query, 'gt')).toEqual([['group_school_id', 'g9']]);
  });

  it('returns the page items and a cursor built from the last delivered school', async () => {
    const data = rows(6);
    supabase.queueFrom('statistic_ranks', ok(data));

    const result = await getSchoolGroupedRanksPage('stat-1', { limit: 5 });

    expect(result.items).toEqual(data.slice(0, 5));
    expect(decodeRankCursor(result.nextCursor as string)).toEqual({
      version: 1,
      statisticId: 'stat-1',
      variant: 'school-grouped-rank',
      groupSchoolId: 'g5',
    });
  });

  it.each([
    [
      'a global-rank cursor',
      () =>
        encodeRankCursor({
          version: 1,
          variant: 'global-rank',
          statisticId: 'stat-1',
          lastId: 'L',
          rank: 5,
        }),
    ],
    [
      'a cursor of another statistic',
      () =>
        encodeRankCursor({
          version: 1,
          variant: 'school-grouped-rank',
          statisticId: 'other',
          groupSchoolId: 'g1',
        }),
    ],
  ])('rejects %s before running any query', async (_title, makeCursor) => {
    await expect(getSchoolGroupedRanksPage('stat-1', { limit: 5, cursor: makeCursor() })).rejects.toThrow(
      invalidForCategory,
    );
    expect(supabase.queries).toHaveLength(0);
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_ranks', fail('boom'));

    await expect(getSchoolGroupedRanksPage('stat-1', { limit: 5 })).rejects.toThrow(
      new ServerError('Failed to fetch the school-grouped ranks page: boom'),
    );
  });
});
