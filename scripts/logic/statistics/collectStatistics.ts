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
  const results: statEntry[] = await makeStatistics();

  // Guardar estadísticas en la base de datos
  await saveStatistics(results);

  const allSummaries = await makeSummaries(results);

  await saveSummaries(allSummaries);

  await log('Estadísticas guardadas en la base de datos.', 'info');
}
