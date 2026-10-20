import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/schools/route';
import { schoolsService } from '@/app/(backend)/api/schools/services/schools.service';
import { ServerError } from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { makeRequest, readJson } from '@/test/helpers/route';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/schools/services/schools.service', () => ({ schoolsService: vi.fn() }));

describe('GET /api/schools', () => {
  describe('query handling', () => {
    it.each([
      ['a query', '/api/schools?query=ikas', { query: 'ikas' }],
      ['no query', '/api/schools', {}],
      ['a blank query', '/api/schools?query=%20%20', {}],
    ])('passes the right params for %s', async (_name, path, expected) => {
      vi.mocked(schoolsService).mockResolvedValue([]);

      await GET(makeRequest(path));

      expect(schoolsService).toHaveBeenCalledWith(expected);
    });

    it('rejects a query longer than 100 characters with 400', async () => {
      const response = await GET(makeRequest(`/api/schools?query=${'a'.repeat(101)}`));

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
      expect(schoolsService).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('responds 200 with the service body and no cache-control', async () => {
      const schools = [{ school: 'Escuela A', schoolKey: 'a' }];
      vi.mocked(schoolsService).mockResolvedValue(schools as never);

      const response = await GET(makeRequest('/api/schools'));

      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(schools);
      expect(response.headers.get('cache-control')).toBeNull();
    });
  });

  describe('errors', () => {
    it('maps ServerError to 500', async () => {
      vi.mocked(schoolsService).mockRejectedValue(new ServerError('x'));

      const response = await GET(makeRequest('/api/schools'));

      expect(response.status).toBe(500);
      expect(await readJson(response)).toEqual({ error: 'Internal server error' });
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(schoolsService).mockRejectedValue(new Error('boom'));

      const response = await GET(makeRequest('/api/schools'));

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith('[GET /api/schools] Unhandled error: boom', 'error');
    });
  });
});
