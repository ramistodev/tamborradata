import { log } from '../../pipeline/helpers';
import { saveUrls } from './saveUrls';
import { findUrls } from './findUrls';

// Lógica para obtener las URLs necesarias para actualizar las estadísticas
export async function collectUrls() {
  log('Recogiendo URLs...\n', 'info');

  // Extraer las URLs de diferentes fuentes
  const {
    totalScrapedUrls,
    serpApiUrls,
    waybackUrls,
    diarioVascoUrls,
  }: {
    totalScrapedUrls: string[];
    serpApiUrls: string[];
    waybackUrls: string[];
    diarioVascoUrls: string[];
  } = await findUrls();

  log(`Total URLs sacadas: ${totalScrapedUrls.length}`, 'info');
  log(`- De Diario Vasco: ${diarioVascoUrls.length}`);
  log(`- De SerpApi: ${serpApiUrls.length}`, 'info');
  log(`- De Wayback Machine: ${waybackUrls.length}\n`, 'info');

  // Guardar las nuevas URLs en la base de datos
  const { newUrls, dbUrls }: { newUrls: string[]; dbUrls: Set<string> } =
    await saveUrls(totalScrapedUrls);

  log(`Nuevas URLs guardadas en la DB: ${newUrls.length}`, 'info');
  log(`URLs existentes en la DB: ${dbUrls.size}\n`, 'info');
}

if (require.main === module) {
  collectUrls();
}
