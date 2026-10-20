export function nextCacheModule() {
  return {
    unstable_cache: <T extends (...args: any[]) => any>(fn: T): T => fn,
    revalidateTag: () => {},
    revalidatePath: () => {},
  };
}
