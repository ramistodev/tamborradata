import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSchools } from '@/app/(backend)/api/schools/repo/schools.repo';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeSchoolRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('getSchools', () => {
  it('selects the schools ordered by name when there is no query', async () => {
    supabase.queueFrom('schools', ok([]));

    await getSchools();

    const query = supabase.lastQuery('schools');
    expect(supabase.methods(query)).toEqual(['select', 'order']);
    expect(supabase.argsOf(query, 'select')).toEqual([['canonical_name, school_key']]);
    expect(supabase.argsOf(query, 'order')).toEqual([['canonical_name', { ascending: true }]]);
  });

  it('adds a case-insensitive contains filter for a query', async () => {
    supabase.queueFrom('schools', ok([]));

    await getSchools('ikas');

    const query = supabase.lastQuery('schools');
    expect(supabase.methods(query)).toEqual(['select', 'order', 'ilike']);
    expect(supabase.argsOf(query, 'ilike')).toEqual([['canonical_name', '%ikas%']]);
  });

  it.each([
    ['an empty string', ''],
    ['undefined', undefined],
  ])('does not filter for %s', async (_title, query) => {
    supabase.queueFrom('schools', ok([]));

    await getSchools(query);

    expect(supabase.methods(supabase.lastQuery('schools'))).not.toContain('ilike');
  });

  it('returns the rows from the database', async () => {
    const rows = [makeSchoolRow()];
    supabase.queueFrom('schools', ok(rows));

    await expect(getSchools()).resolves.toBe(rows);
  });

  it('returns an empty list for null data', async () => {
    supabase.queueFrom('schools', ok(null));

    await expect(getSchools()).resolves.toEqual([]);
  });

  it('rejects with the database message', async () => {
    supabase.queueFrom('schools', fail('boom'));

    await expect(getSchools()).rejects.toThrow(new Error('Failed to fetch the schools: boom'));
  });
});
