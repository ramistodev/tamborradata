import { supabase } from '@/app/(backend)/db/supabase';
import { summariesEntry } from './statTypes';
import { log } from '../helpers';

export async function saveSummaries(summaries: summariesEntry[]) {
  // Si no hay resúmenes, salir
  if (!summaries || summaries.length === 0) {
    log('No hay resúmenes para guardar.', 'info');
    return;
  }

  log(`Guardando ${summaries.length} resúmenes en la base de datos...\n`, 'info');

  // Guardar cada resumen
  for (const summary of summaries) {
    try {
      if (summary.category === 'outro' || summary.category === 'intro') {
        // Usar upsert para evitar duplicados en ejecuciones repetidas
        const { error } = await supabase.from('statistics').upsert(
          {
            category: summary.category,
            scope: summary.scope,
            year: summary.year,
            summary: summary.summary,
          },
          {
            onConflict: 'category,scope,year',
          }
        );

        // Manejar errores
        if (error) {
          log(
            `Error guardando resumen ${summary.category} (${summary.scope} - ${summary.year}): ${error.message}`,
            'error'
          );
        }
      } else {
        // Guardar el resumen en la base de datos
        const { error } = await supabase
          .from('statistics')
          .update({
            summary: summary.summary,
          })
          .eq('category', summary.category)
          .eq('scope', summary.scope)
          .eq('year', summary.year);

        // Manejar errores
        if (error) {
          log(
            `Error guardando resumen ${summary.category} (${summary.scope} - ${summary.year}): ${error.message}`,
            'error'
          );
        }
      }
    } catch (error) {
      // Manejar errores generales
      log(`Error guardando resúmenes: ${error}`, 'error');
      throw new Error(`Error guardando resúmenes: ${error}`);
    }
  }
}
