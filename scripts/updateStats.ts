import { collectUrls } from './pipeline/url/collectUrls';
import { collectParticipants } from './pipeline/participants/collectParticipants';
import { collectStatistics } from './pipeline/statistics/collectStatistics';
import { makeUrlsSnapshot } from './pipeline/snapshot/makeUrlsSnapshot';

export async function updateStats() {
  // Lógica para actualizar las estadísticas de la Tamborrada, esto se ejecutara cada cierto tiempo

  // Conseguir URLs
  await collectUrls();

  await collectParticipants();

  await collectStatistics();

  await makeUrlsSnapshot();
}

if (require.main === module) {
  updateStats();
}
