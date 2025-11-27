import 'server-only';
import { supabaseClient } from '@/app/(backend)/core/db/supabaseClient';
import { log } from '@/app/(backend)/core/logger';
import { FetchCompaniesType } from '../types';

export async function fetchCompanies(): Promise<FetchCompaniesType> {
  try {
    const { data, error } = await supabaseClient
      .from('available_companies_view')
      .select('company_names')
      .order('company_names', { ascending: true });

    // Manejar errores
    if (error) {
      log(`Error obteniendo compañías: ${error.message}`, 'error');
      return { companies: null, error: 'Error de la base de datos' };
    }

    // Si no hay datos, retornar vacío
    if (!data || data.length === 0) {
      log('No se encontraron años en la tabla scraped_urls.', 'info');
      return { companies: null, error: 'No se encontraron compañías disponibles' };
    }

    // Retornar los años como un array ordenado descendente
    return { companies: data.map((item) => item.company_names), error: null };
  } catch (error) {
    // Manejar errores generales
    log(`Error obteniendo años: ${JSON.stringify(error, null, 2)}`, 'error');
    return { companies: null, error: 'Error inesperado, por favor intente nuevamente más tarde' };
  }
}
