import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getOptionalEditorialSections,
  getPublishedEditorialSections,
} from '@/app/(backend)/api/statistics/repo/editorialSections.repo';
import { ServerError } from '@/app/(backend)/lib/errors';
import { fail, ok } from '@/test/helpers/supabaseMock';
import { supabase } from '@/test/helpers/supabaseClientMock';
import { logMock } from '@/test/helpers/loggerMock';

vi.mock('@/app/(backend)/core/db/supabaseClient', async () =>
  (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule(),
);
vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());

beforeEach(() => supabase.reset());

const row = (overrides: Record<string, unknown> = {}) => ({
  id: 'sum-1',
  section: 'periodIntro',
  locale: 'es',
  template: 'Intro text',
  ...overrides,
});

describe('getPublishedEditorialSections', () => {
  it('queries the published summaries of the run and locale', async () => {
    supabase.queueFrom('statistic_summaries', ok([]));

    await getPublishedEditorialSections('run-1', 'es');

    const query = supabase.lastQuery('statistic_summaries');
    expect(supabase.methods(query)).toEqual(['select', 'eq', 'eq', 'eq', 'order', 'order']);
    expect(supabase.argsOf(query, 'select')).toEqual([['id, section, locale, template']]);
    expect(supabase.argsOf(query, 'eq')).toEqual([
      ['run_id', 'run-1'],
      ['locale', 'es'],
      ['status', 'published'],
    ]);
    expect(supabase.argsOf(query, 'order')).toEqual([
      ['section', { ascending: true }],
      ['id', { ascending: true }],
    ]);
  });

  it('removes rows with a null or blank template', async () => {
    supabase.queueFrom(
      'statistic_summaries',
      ok([row(), row({ id: 'sum-2', template: null }), row({ id: 'sum-3', template: '   ' })]),
    );

    const result = await getPublishedEditorialSections('run-1', 'es');

    expect(result.map((section) => section.id)).toEqual(['sum-1']);
  });

  it('maps rows to exactly the four section keys', async () => {
    supabase.queueFrom('statistic_summaries', ok([row({ extra_column: 'leak' })]));

    const result = await getPublishedEditorialSections('run-1', 'es');

    expect(result).toStrictEqual([
      { id: 'sum-1', section: 'periodIntro', locale: 'es', template: 'Intro text' },
    ]);
  });

  it('returns an empty list for null data', async () => {
    supabase.queueFrom('statistic_summaries', ok(null));

    await expect(getPublishedEditorialSections('run-1', 'es')).resolves.toEqual([]);
  });

  it('rejects with ServerError on a database error', async () => {
    supabase.queueFrom('statistic_summaries', fail('boom'));

    await expect(getPublishedEditorialSections('run-1', 'es')).rejects.toThrow(
      new ServerError('Failed to fetch the published editorial sections: boom'),
    );
  });
});

describe('getOptionalEditorialSections', () => {
  it('returns the sections without logging on success', async () => {
    supabase.queueFrom('statistic_summaries', ok([row()]));

    const result = await getOptionalEditorialSections('run-1', 'es');

    expect(result).toStrictEqual([
      { id: 'sum-1', section: 'periodIntro', locale: 'es', template: 'Intro text' },
    ]);
    expect(logMock).not.toHaveBeenCalled();
  });

  it('returns an empty list and logs the problem on error', async () => {
    supabase.queueFrom('statistic_summaries', fail('boom'));

    const result = await getOptionalEditorialSections('run-1', 'es');

    expect(result).toEqual([]);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock).toHaveBeenCalledWith(
      '[statistics] Serving run run-1 (es) without summaries: Failed to fetch the published editorial sections: boom',
      'error',
    );
  });
});
