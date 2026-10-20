import { describe, expect, it, vi } from 'vitest';
import { getSchools } from '@/app/(frontend)/[locale]/services/getSchools';
import { schoolsService } from '@/app/(backend)/api/schools/services/schools.service';
import { ServerError } from '@/app/(backend)/lib/errors';

vi.mock('@/app/(backend)/api/schools/services/schools.service', () => ({
  schoolsService: vi.fn(),
}));
vi.mock('next/cache', async () => (await import('@/test/helpers/nextCacheMock')).nextCacheModule());

const tooLong = 'a'.repeat(101);

describe('getSchools', () => {
  describe('params', () => {
    it.each([
      ['no query', undefined, {}],
      ['an empty query', '', {}],
      ['a query', 'ikas', { query: 'ikas' }],
    ])('calls the service for %s', async (_name, query, expected) => {
      vi.mocked(schoolsService).mockResolvedValue([]);

      await getSchools(query);

      expect(schoolsService).toHaveBeenCalledWith(expected);
    });

    it('returns the service list', async () => {
      const schools = [{ canonicalName: 'Ikastola Test', schoolKey: 'ikastola-test' }];
      vi.mocked(schoolsService).mockResolvedValue(schools as never);

      await expect(getSchools('ikas')).resolves.toEqual(schools);
    });
  });

  describe('errors', () => {
    it('maps an invalid query to a 404 without calling the service', async () => {
      await expect(getSchools(tooLong)).rejects.toMatchObject({
        digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
      });
      expect(schoolsService).not.toHaveBeenCalled();
    });

    it('returns null for an invalid query when nullable', async () => {
      await expect(getSchools(tooLong, true)).resolves.toBeNull();
    });

    it('rethrows ServerError unchanged when not nullable', async () => {
      const error = new ServerError('boom');
      vi.mocked(schoolsService).mockRejectedValue(error);

      await expect(getSchools('ikas')).rejects.toBe(error);
    });

    it('returns null for ServerError when nullable', async () => {
      vi.mocked(schoolsService).mockRejectedValue(new ServerError('boom'));

      await expect(getSchools('ikas', true)).resolves.toBeNull();
    });
  });
});
