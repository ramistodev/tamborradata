import { supabase } from '@/scripts/db/supabase';
import { allParticipants, updateUrls } from '../types';
import { log } from '../../logic/helpers';

// Lógica para guardar los participantes en la base de datos
export async function saveParticipants(
  allParticipants: Set<allParticipants>,
  scrapedUrls: Set<updateUrls>
) {
  // Convertir el Set a un array y eliminar duplicados basados en name, school y article_date
  const uniqueParticipantsArray = Array.from(
    new Map(
      Array.from(allParticipants).map((p) => [`${p.name}-${p.school}-${p.article_date}`, p])
    ).values()
  );

  // Insertar en lotes para evitar problemas con límites de tamaño
  for (let i = 0; i < uniqueParticipantsArray.length; i += 40) {
    try {
      const chunkEnd = Math.min(i + 40, uniqueParticipantsArray.length);
      const chunk = uniqueParticipantsArray.slice(i, chunkEnd);
      const { error: insertError } = await supabase
        .from('participants')
        .upsert(chunk, { onConflict: 'name,school,article_date' });

      // Loguear cualquier error de inserción
      if (insertError) {
        if (insertError && insertError.code !== '23505') {
          log(`Error insertando participantes: ${insertError.message}`, 'error');
        } else {
          log(`✅ Insertados ${chunk.length} participantes`, 'debug');
        }
      }
    } catch (error) {
      // Manejar errores generales
      log(`Error insertando participantes: ${JSON.stringify(error, null, 2)}`, 'error');
      throw new Error(`Error insertando participantes: ${JSON.stringify(error, null, 2)}`);
    }
  }

  log(`${allParticipants.size} participantes guardados en la DB`, 'info');

  // Actualizar las URLs como scrapeadas con la fecha del artículo
  const urlsArray = Array.from(scrapedUrls);
  for (const urlData of urlsArray) {
    try {
      const { error: updateError } = await supabase
        .from('scraped_urls')
        .update({
          is_scraped: true,
          article_date: urlData.article_date,
        })
        .eq('id', urlData.id);

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

  log(`${scrapedUrls.size} URLs actualizadas y marcadas como scrapeadas en la DB`, 'info');
}
