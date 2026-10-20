import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/(backend)/api/participants/route';
import { participantsService } from '@/app/(backend)/api/participants/services/participants.service';
import { NotFoundError, ServerError } from '@/app/(backend)/lib/errors';
import { checkRateLimit } from '@/app/(backend)/lib/ratelimit/rateLimiter';
import { logMock } from '@/test/helpers/loggerMock';
import { jsonRequest, rawRequest, readJson } from '@/test/helpers/route';
import { makeParticipantsResponse } from '@/test/fixtures/participants';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/participants/services/participants.service', () => ({
  participantsService: vi.fn(),
}));
vi.mock('@/app/(backend)/lib/ratelimit/rateLimiter', () => ({ checkRateLimit: vi.fn() }));

const validBody = { participant: 'Ane Garcia Lopez', schoolKey: 'sk' };

describe('POST /api/participants', () => {
  beforeEach(() => {
    vi.mocked(checkRateLimit).mockReturnValue({ allow: true });
  });

  describe('success', () => {
    it('normalizes the body, calls the service and answers 200 without cache-control', async () => {
      const result = [makeParticipantsResponse()];
      vi.mocked(participantsService).mockResolvedValue(result);

      const response = await POST(
        jsonRequest('/api/participants', { participant: 'Ane Garcia Lopez', schoolKey: ' sk ' }),
      );

      expect(participantsService).toHaveBeenCalledWith(['ane', 'garcia', 'lopez'], 'sk');
      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(result);
      expect(response.headers.get('cache-control')).toBeNull();
    });

    it('hands the request headers to the rate limiter', async () => {
      vi.mocked(participantsService).mockResolvedValue([makeParticipantsResponse()]);
      const request = jsonRequest('/api/participants', validBody);

      await POST(request);

      expect(vi.mocked(checkRateLimit).mock.calls[0][0]).toBe(request.headers);
    });
  });

  describe('rate limiting', () => {
    beforeEach(() => {
      vi.mocked(checkRateLimit).mockReturnValue({ allow: false, retryAfterSeconds: 7 });
    });

    it('answers 429 with retry-after and never reads the body or calls the service', async () => {
      const request = jsonRequest('/api/participants', validBody);
      const spy = vi.spyOn(request, 'json');

      const response = await POST(request);

      expect(response.status).toBe(429);
      expect(response.headers.get('retry-after')).toBe('7');
      expect(await readJson(response)).toEqual({ error: 'Too many requests' });
      expect(participantsService).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('checks the limit before the body, so an invalid body still yields 429', async () => {
      const response = await POST(rawRequest('/api/participants', '{bad json'));

      expect(response.status).toBe(429);
    });
  });

  describe('body validation', () => {
    it('answers 400 for invalid JSON without echoing the body', async () => {
      const response = await POST(rawRequest('/api/participants', '{bad json'));
      const text = await response.text();

      expect(response.status).toBe(400);
      expect(JSON.parse(text)).toEqual({ error: 'Invalid request' });
      expect(text).not.toContain('bad json');
      expect(text).not.toContain('{bad');
      expect(participantsService).not.toHaveBeenCalled();
      expect(logMock).not.toHaveBeenCalled();
    });

    it.each([
      ['a null body', null],
      ['fewer than three words', { participant: 'Ane Maria', schoolKey: 'sk' }],
      ['a missing schoolKey', { participant: 'Ane Garcia Lopez' }],
      ['a non string participant', { participant: 1, schoolKey: 'sk' }],
      ['a participant of 121 characters', { participant: `${'a '.repeat(60)}a`, schoolKey: 'sk' }],
    ])('answers 400 for %s', async (_name, body) => {
      const response = await POST(jsonRequest('/api/participants', body));

      expect(response.status).toBe(400);
      expect(await readJson(response)).toEqual({ error: 'Invalid request' });
      expect(participantsService).not.toHaveBeenCalled();
    });
  });

  describe('service errors', () => {
    it('maps NotFoundError to 404', async () => {
      vi.mocked(participantsService).mockRejectedValue(new NotFoundError('x'));

      const response = await POST(jsonRequest('/api/participants', validBody));

      expect(response.status).toBe(404);
    });

    it('maps ServerError to 500', async () => {
      vi.mocked(participantsService).mockRejectedValue(new ServerError('x'));

      const response = await POST(jsonRequest('/api/participants', validBody));

      expect(response.status).toBe(500);
      expect(logMock).not.toHaveBeenCalled();
    });

    it('maps an unclassified error to 500 and logs it with the route tag', async () => {
      vi.mocked(participantsService).mockRejectedValue(new Error('boom'));

      const response = await POST(jsonRequest('/api/participants', validBody));

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith('[POST /api/participants] Unhandled error: boom', 'error');
    });
  });
});
