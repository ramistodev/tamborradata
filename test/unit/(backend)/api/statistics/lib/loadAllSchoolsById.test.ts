import { describe, expect, it, vi } from 'vitest';
import { loadAllSchoolsById } from '@/app/(backend)/api/statistics/lib/loadAllSchoolsById';
import { resolveSchoolIds } from '@/app/(backend)/api/statistics/repo/schools.repo';

vi.mock('@/app/(backend)/api/statistics/repo/schools.repo', () => ({
  resolveSchoolIds: vi.fn(),
}));

describe('loadAllSchoolsById', () => {
  it('indexes the schools by id', async () => {
    const first = { schoolId: 's1', canonicalName: 'Uno', schoolKey: 'uno' };
    const second = { schoolId: 's2', canonicalName: 'Dos', schoolKey: 'dos' };
    vi.mocked(resolveSchoolIds).mockResolvedValue([first, second]);

    const result = await loadAllSchoolsById();

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);
    expect(result.get('s1')).toEqual(first);
    expect(result.get('s2')).toEqual(second);
    expect([...result.keys()]).toEqual(['s1', 's2']);
  });

  it('returns an empty map when there are no schools', async () => {
    vi.mocked(resolveSchoolIds).mockResolvedValue([]);

    const result = await loadAllSchoolsById();

    expect(result.size).toBe(0);
  });

  it('keeps the last row when a school id is duplicated', async () => {
    const last = { schoolId: 's1', canonicalName: 'Ultimo', schoolKey: 'ultimo' };
    vi.mocked(resolveSchoolIds).mockResolvedValue([
      { schoolId: 's1', canonicalName: 'Primero', schoolKey: 'primero' },
      last,
    ]);

    const result = await loadAllSchoolsById();

    expect(result.size).toBe(1);
    expect(result.get('s1')).toEqual(last);
  });

  it('propagates a repo rejection unchanged', async () => {
    const error = new Error('db down');
    vi.mocked(resolveSchoolIds).mockRejectedValue(error);

    await expect(loadAllSchoolsById()).rejects.toBe(error);
  });
});
