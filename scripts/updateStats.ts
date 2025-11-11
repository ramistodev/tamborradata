import { collectUrls } from './pipeline/url/collectUrls';
import { collectParticipants } from './pipeline/participants/collectParticipants';
import { collectStatistics } from './pipeline/statistics/collectStatistics';
import { makeUrlsSnapshot } from './pipeline/snapshot/makeUrlsSnapshot';

export async function updateStats() {
  // Lógica para actualizar las estadísticas de la Tamborrada, esto se ejecutara cada cierto tiempo

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
