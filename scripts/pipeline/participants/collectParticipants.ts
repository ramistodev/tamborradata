import { log } from '../../logic/helpers';
import { scrapParticipants } from './scrapParticipants';
import { saveParticipants } from './saveParticipants';

// Lógica para obtener los participantes de la Tamborrada
export async function collectParticipants() {
  // Recoger los participantes desde las URLs scrapeandolas
  const { allParticipants, scrapedUrls } = await scrapParticipants();

  log(`Total participantes recogidos: ${allParticipants.size}`, 'info');
  log(`Total URLs scrapeadas: ${scrapedUrls.size}\n`, 'info');

  // Guardar los participantes en la base de datos y actualizar las URLs
  await saveParticipants(allParticipants, scrapedUrls);
}
