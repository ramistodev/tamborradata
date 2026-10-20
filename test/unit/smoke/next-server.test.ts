import { describe, expect, it } from 'vitest';
import { jsonRequest, makeRequest, readJson, routeContext } from '@/test/helpers/route';

describe('route helpers', () => {
  it('builds NextRequest objects and a Promise based route context', async () => {
    const request = makeRequest('/api/ping', { headers: { accept: 'application/json' } });
    const post = jsonRequest('/api/participants', { a: 1 });

    expect(request.url).toBe('http://localhost:3000/api/ping');
    expect(request.headers.get('accept')).toBe('application/json');
    expect(post.method).toBe('POST');
    expect(post.headers.get('content-type')).toBe('application/json');
    expect(await post.json()).toEqual({ a: 1 });
    await expect(routeContext({ period: '2024' }).params).resolves.toEqual({ period: '2024' });
    expect(await readJson(Response.json({ ok: true }))).toEqual({ ok: true });
  });
});
