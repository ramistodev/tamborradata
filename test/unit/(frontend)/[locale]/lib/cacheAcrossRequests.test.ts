import { describe, expect, it, vi } from 'vitest';
import { importFresh } from '@/test/helpers/freshImport';

vi.mock('next/cache', () => ({ unstable_cache: vi.fn() }));

async function load() {
  return importFresh(async () => ({
    mod: await import('@/app/(frontend)/[locale]/lib/cacheAcrossRequests'),
    cache: await import('next/cache'),
  }));
}

describe('cacheAcrossRequests', () => {
  it('wraps the callback with unstable_cache outside development', async () => {
    const { mod, cache } = await load();
    const wrapped = vi.fn();
    const callback = vi.fn();
    vi.mocked(cache.unstable_cache).mockReturnValue(wrapped as never);

    const result = mod.cacheAcrossRequests(callback, ['k'], { revalidate: 1 });

    expect(result).toBe(wrapped);
    expect(cache.unstable_cache).toHaveBeenCalledWith(callback, ['k'], { revalidate: 1 });
  });

  it('returns the callback itself in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { mod, cache } = await load();
    const callback = vi.fn();

    const result = mod.cacheAcrossRequests(callback, ['k'], { revalidate: 1 });

    expect(result).toBe(callback);
    expect(cache.unstable_cache).not.toHaveBeenCalled();
  });
});
