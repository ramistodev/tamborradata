import { supabase } from '@/scripts/db/supabase';
import { log } from 'console';

// Función para actualizar el estado del sistema y los años disponibles
// para que el frontend pueda saber el estado de la generación de estadísticas
export async function updateStatus(status: boolean, years?: string[]) {
  // Si la funcion contiene años, entonces actualiza la tabla de available_years
  if (years && years.length > 0) {
    for (const year of years) {
      const { error } = await supabase
        .from('available_years')
        .upsert({ year: year, is_ready: true }, { onConflict: 'year' });

      if (error) {
        log(`Error inserting year ${year}: ${error.message}`, 'error');
      }
    }
  }

  const now = new Date().toISOString();

  // Actualizar el estado de is_updating en la tabla sys_status
  const { error } = await supabase
    .from('sys_status')
    .update({ is_updating: status, updated_at: now })
    .eq('id', 1);

  if (error) {
    log(`Error updating sys_status: ${error.message}`, 'error');
  }
}
