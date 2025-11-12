import { supabase } from '@/scripts/db/supabase';
import { log } from '../../logic/helpers';

export async function updateUrls(urlsToUpdateIds: Set<string>) {
  // Actualizar las URLs como scrapeadas con la fecha del artículo
  for (const id of urlsToUpdateIds) {
    try {
      const { error: updateError } = await supabase
        .from('scraped_urls')
        .update({
          snapshot_taken: true,
        })
        .eq('id', id);

      // Loguear cualquier error de inserción
      if (updateError) {
        log(`Error actualizando nuevas URLs: ${updateError}`, 'error');
      }
    } catch (error) {
      // Manejar errores generales
      log(`Error actualizando nuevas URLs: ${JSON.stringify(error, null, 2)}`, 'error');
      throw new Error(`Error actualizando nuevas URLs: ${JSON.stringify(error, null, 2)}`);
    }
  }

  log(`${urlsToUpdateIds.size} URLs actualizadas y marcadas como snapshot en la DB`, 'info');
}
