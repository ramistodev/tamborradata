import { log } from '../../pipeline/helpers';
import { makeStatistics } from './makeStatistics';
import { makeSummaries } from './makeSummaries';
import { saveInDb } from './saveInDb';
import { updateStatus } from './updateStatus';

// Función principal para recopilar y guardar estadísticas
export async function collectStatistics() {
  log('Iniciando la recopilación de estadísticas...\n', 'info');
  await updateStatus(true);

  // Generar estadísticas
  const statistics = await makeStatistics();

  const allSummaries = await makeSummaries(statistics);

  // Guardar estadísticas en la base de datos
  await saveInDb(statistics, allSummaries);

  log('Estadísticas generadas correctamente y guardadas en la base de datos.', 'info');
}
