import { vi } from 'vitest';

/** Resets the module registry, then runs `load`. ALL dynamic imports needed by one test must run inside the SAME `load` call. */
export async function importFresh<T>(load: () => Promise<T>): Promise<T> {
  vi.resetModules();
  return load();
}
