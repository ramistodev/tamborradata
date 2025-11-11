import { log } from '../../../logic/helpers';
import { waybackParams } from '../../../pipeline/types';

// Función para scrapear URLs de Wayback Machine
export async function fromWaybackApi(): Promise<string[]> {
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
      log(`Wayback Machine returned HTTP status ${response.status}`, 'error');
      return [];
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
    log(`Error fetching from Wayback Machine: ${JSON.stringify(error, null, 2)}`, 'error');
    return [];
  }

  // Devolvemos las URLs recogidas en Wayback Machine
  return Array.from(collectedUrls);
}
