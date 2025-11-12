import 'server-only';
export function groupBy<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]); // asegurar clave string
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
