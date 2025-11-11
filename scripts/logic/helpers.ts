export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Log wrapper — imprime solo si no estamos en producción.
 * @param message Texto a mostrar en consola.
 * @param type Tipo de log ('info', 'warn', 'error', etc.)
 */
export function log(message: string, type: 'info' | 'warn' | 'debug' | 'error' = 'info') {
  if (IS_PRODUCTION) return; // Desactiva logs en producción

  const timestamp = new Date().toISOString();

  switch (type) {
    case 'warn':
      console.warn(`⚠️ [${timestamp}] ${message}`);
      break;
    case 'error':
      console.error(`❌ [${timestamp}] ${message}`);
      break;
    case 'debug':
      console.debug(`🔍 [${timestamp}] ${message}`);
      break;
    default:
      console.log(`🟢 [${timestamp}] ${message}`);
  }
}

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
