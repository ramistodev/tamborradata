'server-only';
import { supabasePublic } from '../../db/supabasePublic';
import { log } from '../helpers/log';

export async function getAllCompanies(): Promise<string[] | null> {
  try {
    const { data, error } = await supabasePublic
      .from('available_companies_view')
      .select('company_names')
      .order('company_names', { ascending: true });

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

    // Retornar los años como un array ordenado descendente
    return data.map((item) => item.company_names);
  } catch (error) {
    // Manejar errores generales
    log(`Error obteniendo años: ${JSON.stringify(error, null, 2)}`, 'error');
    return null;
  }
}
