import 'dotenv/config';
// import { fromSerpApi } from './findUrls/fromSerpApi';
import { fromWaybackApi } from './findUrls/fromWaybackApi';
import { fromDiarioVasco } from './findUrls/fromDiarioVasco';

// Función principal para encontrar URLs
export async function findUrls(): Promise<{
  totalScrapedUrls: string[];
  serpApiUrls: string[];
  waybackUrls: string[];
  diarioVascoUrls: string[];
}> {
  // Lógica para scrapear URLs desde Diario Vasco
  const diarioVascoUrls = await fromDiarioVasco();

  // Lógica para scrapear URLs usando SerpAPI
  // const serpApiUrls = await fromSerpApi();

  const serpApiUrls: string[] = []; // Placeholder until fromSerpApi is fixed

  // Lógica para scrapear URLs usando Wayback Machine
  const waybackUrls = await fromWaybackApi();

  // Combinamos las listas de URLs y eliminamos duplicados
  const scrapedUrls = await combineUrlLists(serpApiUrls, waybackUrls, diarioVascoUrls);

  // Devolvemos todas las URLs scrapadas, junto con las de cada fuente
  return { totalScrapedUrls: scrapedUrls, serpApiUrls, waybackUrls, diarioVascoUrls };
}

// Función para combinar dos listas de URLs y eliminar duplicados
function combineUrlLists(list1: string[], list2: string[], list3: string[]): Promise<string[]> {
  const combinedSet: Set<string> = new Set<string>([...list1, ...list2, ...list3]);
  return Promise.resolve(Array.from(combinedSet));
}
