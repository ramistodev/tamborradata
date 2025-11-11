import { collectUrls } from './pipeline/url/collectUrls';
import { collectParticipants } from './pipeline/participants/collectParticipants';
import { collectStatistics } from './pipeline/statistics/collectStatistics';
import { makeUrlsSnapshot } from './pipeline/snapshot/makeUrlsSnapshot';
import { isUpdated } from './logic/isUpdated';
import { log } from 'console';

// Funcion principal para actualizar las estadísticas
export async function updateStats() {
  // Verificar que no existan datos de este año antes de proceder
  const isData: boolean = await isUpdated();

  if (isData) {
    log('Las estadísticas ya están actualizadas para este año.', 'info');
    return;
  }

  // Encontrar URLs
  await collectUrls();

  // Sacar participantes
  await collectParticipants();

  // Generar estadísticas
  await collectStatistics();

  // Hacer snapshot de URLs
  await makeUrlsSnapshot();
}

if (require.main === module) {
  updateStats();
}
