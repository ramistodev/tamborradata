import { afterEach, describe, expect, it, vi } from 'vitest';
import { importFresh } from '@/test/helpers/freshImport';

const loadEnv = () => importFresh(() => import('@/app/(backend)/core/config/env'));

describe('env', () => {
  describe('defaults from the test environment', () => {
    it('exposes the configured values', async () => {
      const env = await loadEnv();

      expect(env.nextPublicBaseUrl).toBe('http://localhost:3000');
      expect(env.supabaseUrl).toBe('http://127.0.0.1:54321');
      expect(env.supabaseAnonKey).toBe('test-anon-key');
      expect(env.signatureSecret).toBe('test-signature-secret-0123456789abcdef');
      expect(env.hashSecret).toBe('test-hash-secret-0123456789abcdef');
      expect(env.isDev).toBe(false);
    });
  });

  describe('stubbed values', () => {
    it('reflects every variable', async () => {
      vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.org');
      vi.stubEnv('SUPABASE_URL', 'https://db.example.org');
      vi.stubEnv('SUPABASE_ANON_KEY', 'anon-2');
      vi.stubEnv('SIGNATURE_SECRET', 'signature-2');
      vi.stubEnv('HASH_SECRET', 'hash-2');

      const env = await loadEnv();

      expect(env.nextPublicBaseUrl).toBe('https://example.org');
      expect(env.supabaseUrl).toBe('https://db.example.org');
      expect(env.supabaseAnonKey).toBe('anon-2');
      expect(env.signatureSecret).toBe('signature-2');
      expect(env.hashSecret).toBe('hash-2');
    });
  });

  describe('isDev', () => {
    it.each([
      ['development', true],
      ['production', false],
      ['test', false],
    ])('is computed from NODE_ENV=%s', async (nodeEnv, expected) => {
      vi.stubEnv('NODE_ENV', nodeEnv);

      const env = await loadEnv();

      expect(env.isDev).toBe(expected);
    });
  });

  describe('missing variable (characterization of the current behavior)', () => {
    const original = process.env.HASH_SECRET;

    afterEach(() => {
      process.env.HASH_SECRET = original;
    });

    it('imports without validation and leaves the value undefined', async () => {
      delete process.env.HASH_SECRET;

      const env = await loadEnv();

      expect(env.hashSecret).toBeUndefined();
    });
  });
});
