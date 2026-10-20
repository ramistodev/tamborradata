export function singleton<T>(key: string, create: () => T): T {
  const store = globalThis as unknown as Record<string, unknown>;
  const id = `__tdTest_${key}`;
  return (store[id] ??= create()) as T;
}
