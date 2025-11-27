import 'server-only';
import { supabaseClient } from '@/app/(backend)/core/db/supabaseClient';
import { log } from '@/app/(backend)/core/logger';
import { FetchStatisticsType } from '../types';

export async function fetchCategory(year: string, category: string): Promise<FetchStatisticsType> {
  try {
    const { data, error } = await supabaseClient
      .from('statistics')
      .select('full_data')
      .eq('year', year)
      .eq('category', category)
      .maybeSingle();

    if (error) {
      log(`Error al obtener participantes: ${error.message}`, 'error');
      return { category: null, error: 'Error de la base de datos' };
    }

    if (!data || data.full_data.length === 0) {
      log('No se encontraron participantes.', 'error');
      return {
        category: null,
        error: 'Error: No se encontraron datos para la categoría y año especificados',
      };
    }

    return { category: data?.full_data ?? null, error: null };
  } catch (error) {
    log(
      `Error fetching full statistics for ${category} (${year}): ${JSON.stringify(error, null, 2)}`,
      'error'
    );
    return { category: null, error: 'Error inesperado, por favor intente nuevamente más tarde' };
  }
}
