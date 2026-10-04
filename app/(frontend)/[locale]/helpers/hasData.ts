export function hasData<T>(stats: T[] | null | undefined): stats is T[] {
  return Array.isArray(stats) && stats.length > 0 && stats[0] !== undefined;
}
