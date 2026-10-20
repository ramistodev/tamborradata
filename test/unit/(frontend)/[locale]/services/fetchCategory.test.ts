import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CATEGORY_REQUEST_TIMEOUT_MS,
  fetchCategory,
} from '@/app/(frontend)/[locale]/services/fetchCategory';
import { makeCategoryDetail } from '@/test/fixtures/statistics';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe('fetchCategory', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue(jsonResponse(makeCategoryDetail('topNames', 'ranks')));
  });

  const calledUrl = () => fetchMock.mock.calls[0][0] as string;
  const calledSignal = () => fetchMock.mock.calls[0][1].signal as AbortSignal;

  it('exposes a 10 second timeout', () => {
    expect(CATEGORY_REQUEST_TIMEOUT_MS).toBe(10_000);
  });

  describe('url', () => {
    it('has no query string without limit and cursor', async () => {
      await fetchCategory({ period: '2024', category: 'topNames' });

      expect(calledUrl()).toBe('/api/statistics/2024/categories/topNames');
    });

    it.each([
      ['limit and cursor', { limit: 10, cursor: 'abc' }, '?limit=10&cursor=abc'],
      ['only limit', { limit: 10 }, '?limit=10'],
      ['only cursor', { cursor: 'abc' }, '?cursor=abc'],
      ['a zero limit', { limit: 0 }, '?limit=0'],
    ])('builds the query string for %s', async (_name, extra, query) => {
      await fetchCategory({ period: '2024', category: 'topNames', ...extra });

      expect(calledUrl()).toBe(`/api/statistics/2024/categories/topNames${query}`);
    });

    it('encodes the cursor', async () => {
      await fetchCategory({ period: '2024', category: 'topNames', cursor: 'a+b/=' });

      expect(calledUrl()).toContain('cursor=a%2Bb%2F%3D');
    });

    it('encodes the period', async () => {
      await fetchCategory({ period: 'a b', category: 'topNames' });

      expect(calledUrl()).toContain('/api/statistics/a%20b/');
    });
  });

  describe('signal', () => {
    it('passes a timeout signal that is not aborted', async () => {
      await fetchCategory({ period: '2024', category: 'topNames' });

      expect(calledSignal()).toBeInstanceOf(AbortSignal);
      expect(calledSignal().aborted).toBe(false);
    });

    it('aborts the request signal when the caller aborts', async () => {
      const controller = new AbortController();

      await fetchCategory({ period: '2024', category: 'topNames', signal: controller.signal });
      expect(calledSignal().aborted).toBe(false);

      controller.abort();

      expect(calledSignal().aborted).toBe(true);
    });
  });

  describe('response', () => {
    it('returns the body on success', async () => {
      const body = makeCategoryDetail('topNames', 'ranks', 'next');
      fetchMock.mockResolvedValue(jsonResponse(body));

      await expect(fetchCategory({ period: '2024', category: 'topNames' })).resolves.toEqual(body);
    });

    it('rejects with the error message of the body', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'Not found' }, 404));

      await expect(fetchCategory({ period: '2024', category: 'topNames' })).rejects.toThrow(
        new Error('Not found')
      );
    });

    it('rejects with the generic message when the body has no error', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, 500));

      await expect(fetchCategory({ period: '2024', category: 'topNames' })).rejects.toThrow(
        new Error('Failed to fetch category data')
      );
    });
  });
});
