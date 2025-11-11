import { log } from 'console';
import { supabase } from '../db/supabase';

export async function isUpdated(): Promise<boolean> {
  const year = new Date().getFullYear(); // Año actual

  try {
    // Consultar la tabla 'available_years' para ver qué años están disponibles
    const { data, error } = await supabase.from('available_years').select('year');

    // Manejar errores de la consulta
    if (error) {
      log(`Error checking update status: ${JSON.stringify(error)}`, 'error');
      return false;
    }

    const years = data?.map((item) => item.year) || []; // Extraer los años disponibles

    // Retornar si el año actual está en la lista de años disponibles o no
    // si esta devuelve true, si no false
    return years.includes(year.toString());
  } catch (error) {
    // Manejar errores generales
    log(`Error checking update status: ${JSON.stringify(error)}`, 'error');
    return false;
  }
}
