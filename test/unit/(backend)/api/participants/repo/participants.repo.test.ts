import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchParticipants } from '@/app/(backend)/api/participants/repo/participants.repo';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { makeParticipantRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);

beforeEach(() => supabase.reset());

describe('fetchParticipants', () => {
  it('returns the rows from the database', async () => {
    const rows = [makeParticipantRow()];
    supabase.queueFrom('participants', ok(rows));

    const result = await fetchParticipants(['a', 'b'], 'sk');

    expect(result).toBe(rows);
  });

  it('builds the join query with school, status and overlap filters', async () => {
    supabase.queueFrom('participants', ok([]));

    await fetchParticipants(['a', 'b'], 'sk');

    const query = supabase.lastQuery('participants');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'overlaps', 'overlaps', 'returns']);
    expect(String(supabase.argsOf(query, 'select')[0][0]).replace(/\s+/g, ' ')).toBe(
      'name, name_key, year, school:schools!inner(canonical_name, school_key), scraped_url:scraped_urls(url), resolution:participant_name_resolutions!inner(name_keys, surname_keys)',
    );
    expect(supabase.argsOf(query, 'eq')).toEqual([
      ['school.school_key', 'sk'],
      ['resolution.status', 'resolved'],
    ]);
    expect(supabase.argsOf(query, 'overlaps')).toEqual([
      ['resolution.name_keys', '{"a","b"}'],
      ['resolution.surname_keys', '{"a","b"}'],
    ]);
  });

  it('escapes quotes and backslashes in the array literal', async () => {
    supabase.queueFrom('participants', ok([]));

    await fetchParticipants(['a', 'b"c', 'd\\e'], 'sk');

    const query = supabase.lastQuery('participants');
    expect(supabase.argsOf(query, 'overlaps')[0][1]).toBe('{"a","b\\"c","d\\\\e"}');
  });

  it('keeps particle units as a single array element', async () => {
    supabase.queueFrom('participants', ok([]));

    await fetchParticipants(['ramos', 'de la fuente'], 'sk');

    const query = supabase.lastQuery('participants');
    expect(supabase.argsOf(query, 'overlaps')[1][1]).toBe('{"ramos","de la fuente"}');
  });

  it('returns an empty list when the data is null', async () => {
    supabase.queueFrom('participants', ok(null));

    await expect(fetchParticipants(['a'], 'sk')).resolves.toEqual([]);
  });

  it('rejects with the database message', async () => {
    supabase.queueFrom('participants', fail('boom'));

    await expect(fetchParticipants(['a'], 'sk')).rejects.toThrow(
      new Error('Error fetching participants: boom'),
    );
  });
});
