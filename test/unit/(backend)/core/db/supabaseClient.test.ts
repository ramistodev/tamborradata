import { describe, expect, it, vi } from 'vitest';
import { importFresh } from '@/test/helpers/freshImport';

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({ marker: 'client' })) }));

describe('supabaseClient', () => {
  it('creates the client with the configured url and anon key', async () => {
    const { supabaseClient, createClient } = await importFresh(async () => {
      const subject = await import('@/app/(backend)/core/db/supabaseClient');
      const supabaseJs = await import('@supabase/supabase-js');
      return { supabaseClient: subject.supabaseClient, createClient: supabaseJs.createClient };
    });

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith('http://127.0.0.1:54321', 'test-anon-key');
    expect(supabaseClient).toEqual({ marker: 'client' });
  });

  it('reads the url from the environment at import time', async () => {
    vi.stubEnv('SUPABASE_URL', 'http://other');

    const { createClient } = await importFresh(async () => {
      await import('@/app/(backend)/core/db/supabaseClient');
      return import('@supabase/supabase-js');
    });

    expect(createClient).toHaveBeenCalledWith('http://other', 'test-anon-key');
  });
});
