import { describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/(backend)/api/ping/route';
import { logMock } from '@/test/helpers/loggerMock';
import { readJson } from '@/test/helpers/route';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());

describe('GET /api/ping', () => {
  it('responds with status 200', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('responds with a JSON content type', async () => {
    const response = await GET();

    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('reports ok true and a greeting message', async () => {
    const response = await GET();
    const body = await readJson<{ ok: boolean; message: unknown }>(response);

    expect(body.ok).toBe(true);
    expect(typeof body.message).toBe('string');
    expect((body.message as string).startsWith('Tamborradata API funcionando')).toBe(true);
  });

  it('does not log anything', async () => {
    await GET();

    expect(logMock).not.toHaveBeenCalled();
  });
});
