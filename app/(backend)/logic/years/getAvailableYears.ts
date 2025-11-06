import { supabase } from '@/app/(backend)/db/supabase';
import { log } from '../helpers/log';

export async function getAvailableYears() {
  try {
    // Obtener todos los años de los artículos desde la tabla statistics
    const { data, error } = await supabase.from('statistics').select('year');

    // Manejar errores
    if (error) {
      log(`Error obteniendo años: ${error.message}`, 'error');
      return null;
    }

    // Si no hay datos, retornar vacío
    if (!data || data.length === 0) {
      log('No se encontraron años en la tabla scraped_urls.', 'info');
      return null;
    }

    // Filtrar para solo tener años válidos (excluir 'global')
    const onlyYears = data.filter((item) => item.year !== 'global');

    // Extraer años únicos de las fechas obtenidas
    const years = new Set<number>();

    // Recorrer los datos y extraer el año de cada fecha
    for (let i = 0; i < onlyYears.length; i++) {
      const year = parseInt(onlyYears[i].year);
      if (!isNaN(year)) years.add(year);
    }

    // Retornar los años como un array ordenado descendente
    return Array.from(years).sort((a, b) => b - a);
  } catch (error) {
    // Manejar errores generales
    log(`Error obteniendo años: ${error}`, 'error');
    return null;
  }
}
