export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Log para centralizar y controlar los mensajes en consola
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
