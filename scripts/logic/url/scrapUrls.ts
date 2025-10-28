import 'dotenv/config';
import { serpApiParams, waybackParams } from '../types';
import { log } from '../helpers';

// ==== SerpAPI CONFIG ====
const MAX_START = 2000;
const MAX_NO_NEW = 4;
const DELAY_MS = 1000;
const RESULTS_PER_PAGE = 10;
// ==== END ====

// Función principal para scrapear URLs
export async function scrapUrls(): Promise<{
  totalScrapedUrls: string[];
  serpApiUrls: string[];
  waybackUrls: string[];
}> {
  // Lógica para scrapear URLs usando SerpAPI
  const serpApiUrls = await serpApi();

  // Lógica para scrapear URLs usando Wayback Machine
  const waybackUrls = await waybackApi();

  // Combinamos las listas de URLs y eliminamos duplicados
  const scrapedUrls = await combineUrlLists(serpApiUrls, waybackUrls);

  // Devolvemos todas las URLs scrapadas, junto con las de cada fuente
  return { totalScrapedUrls: scrapedUrls, serpApiUrls, waybackUrls };
}

async function serpApi(): Promise<string[]> {
  // Lógica para scrapear URLs de alguna fuente externa
  const serpApiEndpoint = 'https://serpapi.com/search.json';
  const serpApiKey = process.env.SERPAPI_KEY;

  // Query para buscar las URLs de las compañias infantiles de la Tamborrada
  const query = 'site:diariovasco.com/tamborrada/companias/infantiles/ filetype:html';

  // ==== SCRAPING LOGIC ====
  let start = 0;
  let consecutive_no_new = 0;

  const seen_starts: Set<number> = new Set<number>();
  const collectedUrls: Set<string> = new Set<string>();
  // ==== END ====

  // Bucle principal de scraping parara cuando se cumplan las condiciones de parada
  while (true) {
    // Si ya hemos visto esta pagina, la saltamos
    if (seen_starts.has(start)) {
      continue;
    }

    seen_starts.add(start);

    // Parámetros de la petición
    const params: serpApiParams = {
      engine: 'google',
      q: query,
      num: RESULTS_PER_PAGE.toString(),
      start: start.toString(),
      device: 'desktop',
      api_key: serpApiKey,
    };

    // Hacemos la petición a SerpApi
    try {
      const response = await fetch(serpApiEndpoint + '?' + new URLSearchParams(params as any), {
        method: 'GET',
      });

      // Comprobar si la respuesta es correcta
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parsear la respuesta JSON
      const res = await response.json();

      // Extraer resultados
      const results = res.organic_results || [];

      // Contador de URLs nuevas encontradas en esta página
      let urlsFoundThisPage = 0;

      for (const item of results) {
        const link = item.link || item.redirect_link || item.url;
        if (link && link.endsWith('.html') && !collectedUrls.has(link)) {
          collectedUrls.add(link);
          urlsFoundThisPage++;
        }
      }

      // Lógica para manejar la paginación
      const serpPag = res.serpapi_pagination || {};
      const nextLink = serpPag.next_link || serpPag.next;
      let nextStart: number | null = null;

      // Extraer start del next_link si existe
      if (nextLink) {
        try {
          const url = new URL(nextLink);
          const startParam = url.searchParams.get('start');
          if (startParam) {
            nextStart = parseInt(startParam, 10);
          }
        } catch (e) {
          log(`Error parsing next_link URL: ${e}`, 'error');
        }
      }

      // Si no hay next_start, lo calculamos
      if (nextStart === null) {
        nextStart = start + RESULTS_PER_PAGE;
      }

      // Condiciones de parada
      if (nextStart > MAX_START) break;

      // Si ya hemos visto este start, lo ignoramos
      if (seen_starts.has(nextStart)) break;

      // Actualizar el contador de páginas sin nuevas URLs
      if (urlsFoundThisPage === 0) {
        consecutive_no_new++;
      } else {
        consecutive_no_new = 0;
      }

      // Si hemos alcanzado el límite de páginas sin nuevas URLs, paramos
      if (consecutive_no_new >= MAX_NO_NEW) break;

      // Preparar para la siguiente iteración
      start = nextStart;

      // Esperar un poco antes de la siguiente petición para no saturar el API
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      log(`Error fetching from SerpApi: ${error}`, 'error');
      start += RESULTS_PER_PAGE;
      continue;
    }
  }

  // Devolvemos las URLs recogidas en SerpApi
  return Array.from(collectedUrls);
}

// Función para scrapear URLs de Wayback Machine
async function waybackApi(): Promise<string[]> {
  // Lógica para scrapear URLs de Wayback Machine (no implementado en este ejemplo)

  // ==== CONFIG ====
  const waybackMachineEndpoint = 'https://web.archive.org/cdx/search/cdx';
  const params: waybackParams = {
    url: 'diariovasco.com/tamborrada/companias/infantiles/*',
    output: 'json',
    fl: 'original,statuscode,timestamp',
    filter: 'statuscode:200',
    collapse: 'original',
  };
  // ==== END ====

  // Lógica de scraping
  const collectedUrls: Set<string> = new Set<string>();

  // Hacemos la petición a Wayback Machine
  try {
    const response = await fetch(
      waybackMachineEndpoint + '?' + new URLSearchParams(params as any),
      { method: 'GET' }
    );

    // Comprobar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parsear la respuesta JSON
    const res = await response.json();

    // La primera fila es el header, la ignoramos
    const urls: string[] = (res || []).map((entry: any) => entry[0]);

    // Guardamos las URLs que terminan en .html
    for (const url of urls) {
      if (url && url.endsWith('.html')) {
        collectedUrls.add(url);
      }
    }
  } catch (error) {
    log(`Error fetching from Wayback Machine: ${error}`, 'error');
  }

  // Devolvemos las URLs recogidas en Wayback Machine
  return Array.from(collectedUrls);
}

// Función para combinar dos listas de URLs y eliminar duplicados
function combineUrlLists(list1: string[], list2: string[]): Promise<string[]> {
  const combinedSet: Set<string> = new Set<string>([...list1, ...list2]);
  return Promise.resolve(Array.from(combinedSet));
}
