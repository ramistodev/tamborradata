import 'server-only';
import { log } from 'console';
import { saveStatistics } from './saveStatistics';
import { saveSummaries } from './saveSummaries';
import { statEntry, summariesEntry } from './statTypes';
import { updateStatus } from './updateStatus';

// Lógica para guardar las estadísticas y resúmenes en la base de datos
export async function saveInDb(statistics: statEntry[], summaries: summariesEntry[]) {
  // Indicar que el sistema se esta actualizando
  await updateStatus(true);

  try {
    // Guardar estadísticas y resúmenes en la base de datos
    await saveStatistics(statistics);

    await saveSummaries(summaries);

    // Sacamos los años disponibles de los resúmenes
    const years: string[] = [...new Set(summaries.map((s) => s.year))];

    // Indicar que el sistema se ha actualizado y pasar los años
    await updateStatus(false, years);
  } catch (error) {
    log(`Error saving statistics in DB: ${JSON.stringify(error, null, 2)}`, 'error');
    await updateStatus(false);
  }
}
