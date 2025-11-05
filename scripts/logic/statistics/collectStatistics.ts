import { log } from '../helpers';
import { makeStatistics } from './makeStatistics';
import { makeSummaries } from './makeSummaries';
import { saveSummaries } from './saveSummaries';
import { saveStatistics } from './saveStatistics';
import { statEntry } from './statTypes';

// Función principal para recopilar y guardar estadísticas
export async function collectStatistics() {
  log('Iniciando la recopilación de estadísticas...\n', 'info');
  // Generar estadísticas
  const statistics: statEntry[] = await makeStatistics();

  // Guardar estadísticas en la base de datos
  await saveStatistics(statistics);

  const allSummaries = await makeSummaries(statistics);

  await saveSummaries(allSummaries);

  await log('Estadísticas guardadas en la base de datos.', 'info');
}
