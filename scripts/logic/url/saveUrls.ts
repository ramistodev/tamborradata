import { supabase } from '@/scripts/db/supabase';
import { log } from '../helpers';

// Guardar las nuevas URLs en la base de datos Supabase
export async function saveUrls(
  scrapedUrls: string[]
): Promise<{ newUrls: string[]; existingUrlsSet: Set<string> }> {
  // Llamamos a la base de datos y recuperamos las URLs ya almacenadas
  const { data: existingUrlsSet, error } = await supabase.from('scraped_urls').select('url');

  // Si hay un error, lo logueamos y devolvemos arrays vacíos
  if (error) {
    log(`Error al obtener URLs desde Supabase: ${error}`, 'error');
    return { newUrls: [], existingUrlsSet: new Set<string>() };
  }

  // Convertimos las URLs existentes a un Set para evitar duplicados
  const existingArray = Array.isArray(existingUrlsSet) ? existingUrlsSet : [];
  const existingSet: Set<string> = new Set(existingArray.map((u) => u.url));

  // Filtramos y guardamos solo las nuevas URLs
  const newUrls = scrapedUrls.filter((url) => !existingSet.has(url));

  // Guardar las nuevas URLs en la base de datos
  if (newUrls.length > 0) {
    const insertData = newUrls.map((url) => ({
      url,
      is_scraped: false,
    }));

    // Insertar en lotes para evitar problemas con límites de tamaño
    if (insertData.length > 0) {
      // Insertar en lotes de 50
      for (let i = 0; i < insertData.length; i += 50) {
        try {
          const chunkEnd = i + 50 > insertData.length ? insertData.length : i + 50;
          const chunk = insertData.slice(i, chunkEnd);
          const { error: insertError } = await supabase.from('scraped_urls').insert(chunk);

          // Loguear cualquier error de inserción
          if (insertError) {
            log(`Error insertando nuevas URLs: ${insertError}`, 'error');
          }
        } catch (error) {
          log(`Error insertando nuevas URLs: ${error}`, 'error');
          throw new Error(`Error insertando nuevas URLs: ${error}`);
        }
      }
    }
  }

  // Devolvemos las nuevas URLs y las URLs existentes
  return {
    newUrls,
    existingUrlsSet: existingSet,
  };
}
