import { statEntry } from './statTypes';
import { supabase } from '@/scripts/db/supabase';
import { log } from '../helpers';

// Función para guardar las estadísticas en la base de datos
export async function saveStatistics(statistics: statEntry[]) {
  try {
    // Guardar cada estadística
    for (const stat of statistics) {
      // Guardar estadisticas globales
      if (stat.scope === 'global') {
        const fullData = JSON.parse(JSON.stringify(stat.data));
        const publicData = Array.isArray(fullData) ? fullData.slice(0, 15) : fullData;

        const { error } = await supabase.from('statistics').upsert(
          {
            category: stat.category,
            scope: stat.scope,
            public_data: publicData,
            full_data: fullData,
            year: 'global', // Importante: year debe ser 'global' para globales
          },
          {
            onConflict: 'category,scope,year',
          }
        );

        // Manejar errores
        if (error)
          log(
            `Error guardando estadística ${stat.category} (${stat.scope}): ${error.message}`,
            'error'
          );

        // Pequeña pausa para evitar sobrecargar la base de datos
        await new Promise((r) => setTimeout(r, 200));
      }

      // Guardar estadísticas por año
      if (stat.scope === 'yearly') {
        const entries = Object.entries(stat.data).map(([year, data]) => {
          const fullData = JSON.parse(JSON.stringify(data));
          const publicData = Array.isArray(fullData) ? fullData.slice(0, 15) : fullData;

          return {
            category: stat.category,
            scope: stat.scope,
            year: year,
            public_data: publicData,
            full_data: fullData,
          };
        });

        const { error } = await supabase.from('statistics').upsert(entries, {
          onConflict: 'category,scope,year',
        });

        if (error)
          log(`Error guardando ${stat.category} (${stat.scope}): ${error.message}`, 'error');
      }

      // Pequeña pausa para evitar sobrecargar la base de datos
      await new Promise((r) => setTimeout(r, 200));
    }
  } catch (error) {
    log(`Error guardando estadísticas: ${error}`, 'error');
    throw new Error(`Error guardando estadísticas: ${error}`);
  }
}
