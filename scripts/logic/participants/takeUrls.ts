import { supabase } from '@/app/lib/db/supabase';
import { log } from '../helpers';

// Lógica para tomar las URLs no scrapeadas de la base de datos Supabase
export async function takeUrls(): Promise<{ id: string; url: string }[]> {
  // Configuracion de paginación
  const BATCH_SIZE = 100; // Número de URLs a recuperar por lote
  let from = 0;
  let to = BATCH_SIZE - 1;
  const MAX = 2000; // Límite máximo de URLs a procesar

  // Array para almacenar todas las URLs sacadas de la base de datos
  const allUrls: { id: string; url: string }[] = [];

  // Bucle para paginar a través de las URLs no scrapeadas
  while (true) {
    try {
      const { data: urlsBatch, error } = await supabase
        .from('scraped_urls')
        .select('id, url')
        .eq('is_scraped', false)
        .range(from, to);

      if (error) {
        log(`Error fetching URLs (range ${from}-${to}): ${error.message}`, 'error');
        break;
      }

      // Si no hay más URLs, salimos del bucle
      if (!urlsBatch || urlsBatch.length === 0) break;

      // Si hemos alcanzado el límite máximo, salimos del bucle
      if (allUrls.length >= MAX) {
        log(`⚠️ Límite máximo de ${MAX} URLs alcanzado, deteniendo lectura.`, 'warn');
        break;
      }

      // Añadimos el lote actual al array principal
      allUrls.push(...urlsBatch);

      log(`🧩 Cargadas ${urlsBatch.length} URLs (total acumulado: ${allUrls.length})`, 'info');

      // Mover al siguiente bloque
      from += BATCH_SIZE;
      to += BATCH_SIZE;
    } catch (error) {
      // Manejar errores generales
      log(`Error fetching URLs (range ${from}-${to}): ${error}`, 'error');
      throw new Error(`Error fetching URLs (range ${from}-${to}): ${error}`);
    }
  }

  return allUrls;
}
