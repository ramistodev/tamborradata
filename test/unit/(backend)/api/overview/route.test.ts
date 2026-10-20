import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/overview/route';
import { overviewService } from '@/app/(backend)/api/overview/service/overview.service';
import { NotFoundError, ServerError } from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { makeRequest, readJson } from '@/test/helpers/route';
import { makeOverviewResponse } from '@/test/fixtures/overview';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/overview/service/overview.service', () => ({ overviewService: vi.fn() }));

describe('GET /api/overview', () => {
  describe('scope handling', () => {
    it.each([
      ['global', '/api/overview?scope=global'],
      ['last', '/api/overview?scope=last'],
      ['both', '/api/overview?scope=both'],
      ['both', '/api/overview'],
    ])('passes scope %s to the service for %s', async (expectedScope, path) => {
      const overview = makeOverviewResponse();
      vi.mocked(overviewService).mockResolvedValue(overview);

      const response = await GET(makeRequest(path));

      expect(overviewService).toHaveBeenCalledWith(expectedScope);
      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(overview);
    });

    it('rejects an unknown scope with 400 and does not call the service', async () => {
      const response = await GET(makeRequest('/api/overview?scope=x'));

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
      expect(overviewService).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    it('maps NotFoundError to 404', async () => {
      vi.mocked(overviewService).mockRejectedValue(new NotFoundError('x'));

      const response = await GET(makeRequest('/api/overview'));

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: 'Not found' });
    });

    it('maps ServerError to 500', async () => {
      vi.mocked(overviewService).mockRejectedValue(new ServerError('x'));

      const response = await GET(makeRequest('/api/overview'));

      expect(response.status).toBe(500);
      expect(await readJson(response)).toEqual({ error: 'Internal server error' });
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(overviewService).mockRejectedValue(new Error('boom'));

      const response = await GET(makeRequest('/api/overview'));

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith('[GET /api/overview] Unhandled error: boom', 'error');
    });
  });
});
