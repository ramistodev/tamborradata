import { supabase } from '@/app/lib/db/supabase';
import { log } from '../helpers';

// Función para obtener todos los años únicos de los artículos scrapeados
export async function takeYears(): Promise<number[]> {
  try {
    // Obtener todas las fechas de los artículos desde la tabla scraped_urls
    const { data, error } = await supabase.from('scraped_urls').select('article_date');

    // Manejar errores
    if (error) {
      log(`Error obteniendo años: ${error.message}`, 'error');
      return [];
    }

    // Si no hay datos, retornar vacío
    if (!data || data.length === 0) {
      log('No se encontraron años en la tabla scraped_urls.', 'info');
      return [];
    }

    // Extraer años únicos de las fechas obtenidas
    const years = new Set<number>();

    // Recorrer los datos y extraer el año de cada fecha
    for (let i = 0; i < data.length; i++) {
      const year = parseInt(data[i].article_date?.slice(0, 4));
      if (!isNaN(year)) years.add(year);
    }

    // Retornar los años como un array ordenado
    return Array.from(years).sort((a, b) => a - b);
  } catch (error) {
    // Manejar errores generales
    log(`Error obteniendo años: ${error}`, 'error');
    throw new Error(`Error obteniendo años: ${error}`);
  }
}
