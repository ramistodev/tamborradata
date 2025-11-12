import { getUrls } from '@/scripts/pipeline/participants/getUrls';
import { log } from '../../logic/helpers';
import { updateUrls } from './updateUrls';
import { fetchWithRetry } from '@/scripts/utils/fetchWithRetry';

export async function makeUrlsSnapshot() {
  log('Iniciando snapshot de URLs en Wayback Machine...', 'info');
  log('Esto puede tardar unos minutos, o horas...', 'info');

  // Obtener las URLs no scrapeadas
  const urls = await getUrls();

  if (!urls || urls.length === 0) {
    log('No hay URLs pendientes para snapshot', 'info');
    return;
  }

  // Guardar las URLs en Wayback Machine
  const savedUrlsId = await saveInWayback(urls);

  // Actualizar las URLs en la base de datos como snapshot_taken = true
  if (savedUrlsId && savedUrlsId.size > 0) {
    await updateUrls(savedUrlsId);
  }
}

async function saveInWayback(
  urlsToSave: { id: string; url: string }[]
): Promise<Set<string> | null> {
  const savedUrlsId = new Set<string>();

  // Guardar cada URL en Wayback Machine con manejo de errores
  for (const { id, url } of urlsToSave) {
    try {
      // Fetch con reintentos
      const res = await fetchWithRetry('http://web.archive.org/save/' + encodeURIComponent(url), {
        method: 'GET',
      });

      // Comprobar si la respuesta es correcta
      if (!res.ok) {
        log(`Error al guardar en Wayback Machine: ${url}`, 'error');
        continue;
      }

      log(`Guardado en Wayback Machine: ${url}`, 'info');

      // Agregar el ID de la URL guardada al conjunto
      savedUrlsId.add(id);

      // Esperar 1 segundo entre cada solicitud para no sobrecargar Wayback Machine
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      log(
        `Error al guardar en Wayback Machine: ${url} - ${JSON.stringify(error, null, 2)}`,
        'error'
      );
    }
  }

  // Si no se guardó ninguna URL, retornar null
  if (savedUrlsId.size === 0) {
    log('No se han guardado URLs nuevos en Wayback Machine.', 'warn');
    return null;
  }

  return savedUrlsId;
}
