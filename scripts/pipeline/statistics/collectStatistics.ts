import { log } from '../../pipeline/helpers';
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

  const allSummaries = await makeSummaries(statistics);

  // Guardar estadísticas en la base de datos
  await saveStatistics(statistics);

  await saveSummaries(allSummaries);

  log('Estadísticas generadas correctamente y guardadas en la base de datos.', 'info');
}
