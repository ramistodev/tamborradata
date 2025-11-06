import { log } from '../../../pipeline/helpers';
import { serpApiParams } from '../../../pipeline/types';

export async function fromSerpApi(): Promise<string[]> {
  // Lógica para scrapear URLs de alguna fuente externa
  const serpApiEndpoint = 'https://serpapi.com/search.json';
  const serpApiKey = process.env.SERPAPI_KEY;

  // ==== CONFIG ====
  const MAX_START = 2000;
  const MAX_NO_NEW = 4;
  const DELAY_MS = 1000;
  const RESULTS_PER_PAGE = 10;
  // ==== END ====

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
        log(`SerpApi returned HTTP status ${response.status}`, 'error');
        return [];
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

      // Actualizar el contador de páginas sin nuevas URLs
      if (urlsFoundThisPage === 0) {
        consecutive_no_new++;
      } else {
        consecutive_no_new = 0;
      }

      // Condiciones de parada
      // Si hemos alcanzado el límite de páginas sin nuevas URLs, paramos
      if (consecutive_no_new >= MAX_NO_NEW) break;

      // Si hemos superado el máximo start permitido, paramos
      if (nextStart > MAX_START) break;

      // Si ya hemos visto este start, lo ignoramos
      if (seen_starts.has(nextStart)) break;

      // Preparar para la siguiente iteración
      start = nextStart;

      // Esperar un poco antes de la siguiente petición para no saturar el API
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      log(`Error fetching from SerpApi: ${error}`, 'error');
      return [];
    }
  }

  // Devolvemos las URLs recogidas en SerpApi
  return Array.from(collectedUrls);
}
