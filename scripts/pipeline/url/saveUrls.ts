import 'server-only';
import { supabase } from '@/scripts/db/supabase';
import { log } from '../../logic/helpers';

// Guardar las nuevas URLs en la base de datos Supabase
export async function saveUrls(
  urls: string[]
): Promise<{ newUrls: string[]; dbUrls: Set<string> }> {
  log(`Guardando URLs en la base de datos...`, 'info');

  // Llamamos a la base de datos y recuperamos las URLs ya almacenadas
  const { data: dbUrls, error } = await supabase.from('scraped_urls').select('url');

  // Si hay un error, lo logueamos y devolvemos arrays vacíos
  if (error) {
    log(`Error al obtener URLs desde Supabase: ${JSON.stringify(error)}`, 'error');
    return { newUrls: [], dbUrls: new Set<string>() };
  }

  // Convertimos las URLs que tenemos en la DB a un Set para evitar duplicados
  const existingArray = Array.isArray(dbUrls) ? dbUrls : [];
  const existingSet: Set<string> = new Set(existingArray.map((u) => u.url));

  // Filtramos y guardamos solo las nuevas URLs
  const newUrls = urls.filter((url) => !existingSet.has(url));

  // Guardar las nuevas URLs en la base de datos
  if (newUrls.length > 0) {
    const insertData = newUrls.map((url) => ({
      url,
      is_scraped: false,
      snapshot_taken: false,
    }));

    // Insertar en lotes para evitar problemas con límites de tamaño
    if (insertData.length > 0) {
      // Insertar en lotes de 25
      for (let i = 0; i < insertData.length; i += 25) {
        try {
          const chunkEnd = i + 25 > insertData.length ? insertData.length : i + 25;
          const chunk = insertData.slice(i, chunkEnd);
          const { error: insertError } = await supabase
            .from('scraped_urls')
            .upsert(chunk, { onConflict: 'url' })
            .select();

          // Loguear cualquier error de inserción
          if (insertError) {
            log(`Error insertando nuevas URLs: ${JSON.stringify(insertError)}`, 'error');
          }
        } catch (error) {
          log(`Error insertando nuevas URLs: ${JSON.stringify(error, null, 2)}`, 'error');
          throw new Error(`Error insertando nuevas URLs: ${JSON.stringify(error, null, 2)}`);
        }
      }
    }
  }

  // Devolvemos las nuevas URLs y las URLs existentes
  return {
    newUrls,
    dbUrls: existingSet,
  };
}
