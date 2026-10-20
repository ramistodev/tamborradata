import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchParticipants } from '@/app/(frontend)/[locale]/services/fetchParticipants';
import { RateLimitedError } from '@/app/(frontend)/[locale]/lib/errors';
import { makeParticipantsResponse } from '@/test/fixtures/participants';

const jsonResponse = (body: unknown, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), { status, headers });

describe('fetchParticipants', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('success', () => {
    it('posts the participant and school key and returns the parsed array', async () => {
      const body = [makeParticipantsResponse()];
      fetchMock.mockResolvedValue(jsonResponse(body));

      const result = await fetchParticipants({ participant: 'Ane Garcia Lopez', schoolKey: 'sk' });

      expect(result).toEqual(body);
      expect(fetchMock).toHaveBeenCalledWith('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant: 'Ane Garcia Lopez', schoolKey: 'sk' }),
        signal: undefined,
      });
    });

    it('returns an empty array when there are no matches', async () => {
      fetchMock.mockResolvedValue(jsonResponse([]));

      await expect(fetchParticipants({ participant: 'Nobody', schoolKey: 'sk' })).resolves.toEqual(
        []
      );
    });

    it('passes the caller signal through to fetch', async () => {
      const controller = new AbortController();
      fetchMock.mockResolvedValue(jsonResponse([]));

      await fetchParticipants({ participant: 'Ane', schoolKey: 'sk', signal: controller.signal });

      expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
    });
  });

  describe('rate limiting', () => {
    it('rejects with RateLimitedError carrying the Retry-After header', async () => {
      fetchMock.mockResolvedValue(new Response('x', { status: 429, headers: { 'Retry-After': '120' } }));

      const error = await fetchParticipants({ participant: 'Ane', schoolKey: 'sk' }).catch(
        (caught: unknown) => caught
      );

      expect(error).toBeInstanceOf(RateLimitedError);
      expect((error as RateLimitedError).retryAfterSeconds).toBe(120);
    });

    it.each([
      ['a missing header', undefined],
      ['a non-numeric header', 'abc'],
      ['a zero header', '0'],
      ['a negative header', '-5'],
    ])('falls back to 60 seconds for %s', async (_name, header) => {
      fetchMock.mockResolvedValue(
        new Response('x', { status: 429, headers: header ? { 'Retry-After': header } : undefined })
      );

      const error = await fetchParticipants({ participant: 'Ane', schoolKey: 'sk' }).catch(
        (caught: unknown) => caught
      );

      expect(error).toBeInstanceOf(RateLimitedError);
      expect((error as RateLimitedError).retryAfterSeconds).toBe(60);
    });
  });

  describe('errors', () => {
    it('rejects with the error message of the body', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'Invalid request' }, 400));

      await expect(fetchParticipants({ participant: '', schoolKey: 'sk' })).rejects.toThrow(
        new Error('Invalid request')
      );
    });

    it.each([
      ['an empty object', {}],
      ['a null body', null],
    ])('rejects with the generic message for %s', async (_name, body) => {
      fetchMock.mockResolvedValue(jsonResponse(body, 500));

      await expect(fetchParticipants({ participant: 'Ane', schoolKey: 'sk' })).rejects.toThrow(
        new Error('Failed to fetch participants')
      );
    });

    it('rejects with the same error on a network failure', async () => {
      const failure = new TypeError('Failed to fetch');
      fetchMock.mockRejectedValue(failure);

      await expect(fetchParticipants({ participant: 'Ane', schoolKey: 'sk' })).rejects.toBe(failure);
    });
  });
});
