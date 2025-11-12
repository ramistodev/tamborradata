import 'server-only';
import { supabasePublic } from '@/app/(backend)/db/supabasePublic';
import { log } from '../helpers/log';

export async function getAvailableYears(): Promise<number[] | null> {
  try {
    // Obtener todos los años de los artículos desde la tabla available_years
    const { data, error } = await supabasePublic
      .from('available_years')
      .select('year')
      .order('year', { ascending: true });

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
    const years = data
      .filter((item) => item.year !== 'global')
      .map((item) => parseInt(item.year, 10));

    // Retornar los años como un array ordenado descendente
    return Array.from(years).sort((a, b) => b - a);
  } catch (error) {
    // Manejar errores generales
    log(`Error obteniendo años: ${JSON.stringify(error, null, 2)}`, 'error');
    return null;
  }
}
