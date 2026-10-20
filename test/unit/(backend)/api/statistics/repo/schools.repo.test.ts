import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveSchoolIds } from '@/app/(backend)/api/statistics/repo/schools.repo';
import { ServerError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('resolveSchoolIds', () => {
  it('maps the rows to schools with their id', async () => {
    supabase.queueFrom('schools', ok([{ id: 's1', canonical_name: 'Uno', school_key: 'uno' }]));

    const result = await resolveSchoolIds();

    expect(result).toStrictEqual([{ schoolId: 's1', canonicalName: 'Uno', schoolKey: 'uno' }]);
  });

  it('selects the id, name and key columns', async () => {
    supabase.queueFrom('schools', ok([]));

    await resolveSchoolIds();

    const query = supabase.lastQuery('schools');
    expect(supabase.methods(query)).toEqual(['select']);
    expect(supabase.argsOf(query, 'select')).toEqual([['id, canonical_name, school_key']]);
  });

  it('returns an empty list for an empty table', async () => {
    supabase.queueFrom('schools', ok([]));

    await expect(resolveSchoolIds()).resolves.toEqual([]);
  });

  it('rejects when the data is null', async () => {
    supabase.queueFrom('schools', ok(null));

    await expect(resolveSchoolIds()).rejects.toThrow(new Error('No school was found.'));
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('schools', fail('boom'));

    await expect(resolveSchoolIds()).rejects.toThrow(new ServerError('Failed to fetch the school: boom'));
  });
});
