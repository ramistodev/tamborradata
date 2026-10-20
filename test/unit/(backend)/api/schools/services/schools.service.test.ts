import { describe, expect, it, vi } from 'vitest';
import { schoolsService } from '@/app/(backend)/api/schools/services/schools.service';
import { getSchools } from '@/app/(backend)/api/schools/repo/schools.repo';
import { makeSchoolRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/api/schools/repo/schools.repo', () => ({
  getSchools: vi.fn(),
}));

describe('schoolsService', () => {
  it('maps the rows to the public school shape', async () => {
    vi.mocked(getSchools).mockResolvedValue([
      makeSchoolRow({ canonical_name: 'Escuela A', school_key: 'a' }),
      makeSchoolRow({ canonical_name: 'Escuela B', school_key: 'b' }),
    ]);

    const result = await schoolsService({});

    expect(result).toEqual([
      { school: 'Escuela A', schoolKey: 'a' },
      { school: 'Escuela B', schoolKey: 'b' },
    ]);
  });

  it('calls the repo with undefined when there is no query', async () => {
    vi.mocked(getSchools).mockResolvedValue([]);

    await schoolsService({});

    expect(getSchools).toHaveBeenCalledWith(undefined);
  });

  it('forwards the query to the repo', async () => {
    vi.mocked(getSchools).mockResolvedValue([]);

    await schoolsService({ query: 'ikas' });

    expect(getSchools).toHaveBeenCalledWith('ikas');
  });

  it('returns an empty list when no school matches', async () => {
    vi.mocked(getSchools).mockResolvedValue([]);

    await expect(schoolsService({ query: 'zzz' })).resolves.toEqual([]);
  });

  it('propagates a repo rejection unchanged', async () => {
    const error = new Error('db down');
    vi.mocked(getSchools).mockRejectedValue(error);

    await expect(schoolsService({})).rejects.toBe(error);
  });
});
