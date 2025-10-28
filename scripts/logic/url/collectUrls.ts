import { log } from '../helpers';
import { saveUrls } from './saveUrls';
import { scrapUrls } from './scrapUrls';

// Lógica para obtener las URLs necesarias para actualizar las estadísticas
export async function collectUrls() {
  // Extraer las URLs de diferentes fuentes
  const {
    totalScrapedUrls,
    serpApiUrls,
    waybackUrls,
  }: {
    totalScrapedUrls: string[];
    serpApiUrls: string[];
    waybackUrls: string[];
  } = await scrapUrls();

  log(`Total URLs sacadas: ${totalScrapedUrls.length}`, 'info');
  log(`- De SerpApi: ${serpApiUrls.length}`, 'info');
  log(`- De Wayback Machine: ${waybackUrls.length}\n`, 'info');

  // Guardar las nuevas URLs en la base de datos
  const { newUrls, existingUrlsSet }: { newUrls: string[]; existingUrlsSet: Set<string> } =
    await saveUrls(totalScrapedUrls);

  log(`Nuevas URLs guardadas en la DB: ${newUrls.length}`, 'info');
  log(`URLs existentes en la DB: ${existingUrlsSet.size}\n`, 'info');
}
