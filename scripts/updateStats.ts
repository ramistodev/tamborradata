// import { collectUrls } from './logic/url/collectUrls';
// import { collectParticipants } from './logic/participants/collectParticipants';
import { collectStatistics } from './logic/statistics/collectStatistics';

export async function updateStats() {
  // Lógica para actualizar las estadísticas de la Tamborrada, esto se ejecutara cada cierto tiempo

  // Conseguir URLs
  // await collectUrls();

  // await collectParticipants();

  await collectStatistics();
}

if (require.main === module) {
  updateStats();
}
