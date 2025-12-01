import 'server-only';
import { supabaseClient } from '@/app/(backend)/core/db/supabaseClient';
import { FetchYearsType } from '../types';
import { log } from '@/app/(backend)/core/logger';

export async function fetchYears(): Promise<FetchYearsType> {
  try {
    // Obtener todos los años de los artículos desde la tabla available_years
    const { data, error } = await supabaseClient
      .from('available_years')
      .select('year')
      .order('year', { ascending: true });

    // Manejar errores
    if (error) {
      log(`Error obteniendo años: ${error.message}`, 'error');
      return { years: null, error: 'Error de la base de datos' };
    }

    // Si no hay datos, retornar vacío
    if (!data || data.length === 0) {
      log('No se encontraron años en la tabla scraped_urls.', 'info');
      return { years: null, error: 'No se encontraron años' };
    }

    // Retornar los años como un array ordenado descendente
    return {
      years: data.map((item) => item.year),
      error: null,
    };
  } catch (error) {
    // Manejar errores generales
    log(`Error obteniendo años: ${JSON.stringify(error, null, 2)}`, 'error');
    return { years: null, error: 'Error inesperado, por favor intente nuevamente más tarde' };
  }
}
