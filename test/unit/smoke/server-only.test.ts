import { describe, expect, it } from 'vitest';

describe('server-only alias and test.env', () => {
  it('imports modules guarded by server-only and reads the fake env', async () => {
    await expect(import('@/app/(backend)/lib/errors')).resolves.toBeDefined();

    const env = await import('@/app/(backend)/core/config/env');

    expect(env.signatureSecret).toBe(process.env.SIGNATURE_SECRET);
    expect(env.signatureSecret).toBe('test-signature-secret-0123456789abcdef');
    expect(env.isDev).toBe(false);
  });
});
