import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/period/route';
import { periodService } from '@/app/(backend)/api/period/service/period.service';
import { NotFoundError, ServerError } from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { readJson } from '@/test/helpers/route';
import { makePeriodList } from '@/test/fixtures/period';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/period/service/period.service', () => ({ periodService: vi.fn() }));

describe('GET /api/period', () => {
  describe('success', () => {
    it('responds 200 with the service result and no cache-control', async () => {
      const periods = makePeriodList();
      vi.mocked(periodService).mockResolvedValue(periods);

      const response = await GET();

      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(periods);
      expect(response.headers.get('cache-control')).toBeNull();
      expect(periodService).toHaveBeenCalledTimes(1);
    });
  });

  describe('errors', () => {
    beforeEach(() => {
      vi.mocked(periodService).mockReset();
    });

    it('maps NotFoundError to 404', async () => {
      vi.mocked(periodService).mockRejectedValue(new NotFoundError('x'));

      const response = await GET();

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: 'Not found' });
      expect(response.headers.get('cache-control')).toBe('no-store');
    });

    it('maps ServerError to 500 without logging', async () => {
      vi.mocked(periodService).mockRejectedValue(new ServerError('x'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await readJson(response)).toEqual({ error: 'Internal server error' });
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(periodService).mockRejectedValue(new Error('boom'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await readJson(response)).toEqual({ error: 'Internal server error' });
      expect(logMock).toHaveBeenCalledWith('[GET /api/period] Unhandled error: boom', 'error');
    });
  });
});
