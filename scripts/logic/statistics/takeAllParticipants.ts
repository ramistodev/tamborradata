import { supabase } from '@/app/lib/db/supabase';
import { allParticipants } from '../types';
import { log } from '../helpers';

// Función para obtener todos los participantes de la base de datos en lotes
export async function takeAllParticipants(): Promise<allParticipants[]> {
  const BATCH_SIZE = 250; // Número de participantes a recuperar por lote
  let from = 0;
  let to = BATCH_SIZE - 1;
  const MAX = 100000; // Límite máximo

  // Array para almacenar todos los participantes
  const allParticipants: allParticipants[] = [];

  // Recuperar participantes en lotes hasta que no queden más
  while (true) {
    try {
      // Recuperar un lote de participantes
      const { data: participantsBatch, error } = await supabase
        .from('participants')
        .select('name, school, article_date, year, url_id')
        .range(from, to);

      // Manejar errores
      if (error) {
        log(`Error fetching participants (range ${from}-${to}): ${error.message}`, 'error');
        break;
      }

      // Si no hay más participantes, salir del bucle
      if (participantsBatch.length <= 0) break;

      // Verificar si se ha alcanzado el límite máximo si no salir del bucle
      if (allParticipants.length >= MAX) {
        log(`⚠️ Límite máximo de ${MAX} participantes alcanzado, deteniendo lectura.`, 'warn');
        break;
      }

      // Añadir el lote recuperado al array principal
      allParticipants.push(...participantsBatch);

      // Actualizar los índices para el siguiente lote
      from += BATCH_SIZE;
      to += BATCH_SIZE;
    } catch (error) {
      // Manejar errores generales
      log(`Error fetching participants (range ${from}-${to}): ${error}`, 'error');
      throw new Error(`Error fetching participants (range ${from}-${to}): ${error}`);
    }
  }

  return allParticipants;
}
