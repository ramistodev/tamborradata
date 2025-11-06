import { getUrls } from '@/scripts/pipeline/participants/getUrls';
import { log } from '../helpers';
import { updateUrls } from './updateUrls';

export async function makeUrlsSnapshot() {
  log('Iniciando snapshot de URLs en Wayback Machine...', 'info');
  log('Esto puede tardar unos minutos, o horas...', 'info');

  const urls = await getUrls();

  const savedUrlsId = await saveInWayback(urls);

  if (savedUrlsId && savedUrlsId.size > 0) {
    await updateUrls(savedUrlsId);
  }
}

async function saveInWayback(
  urlsToSave: { id: string; url: string }[]
): Promise<Set<string> | null> {
  try {
    const savedUrlsId = new Set<string>();

    let attempts = 0;
    for (const { id, url } of urlsToSave) {
      log(`Guardando en Wayback Machine: ${url}`, 'info');
      const res = await fetch('http://web.archive.org/save/' + encodeURIComponent(url), {
        method: 'GET',
      });

      // await new Promise((r) => setTimeout(r, 1000));

      if (!res.ok) {
        log(`Error al guardar en Wayback Machine: ${url}`, 'error');
        attempts++;
      }

      if (attempts >= 5) {
        log('Demasiados errores al guardar en Wayback Machine, abortando.', 'error');
        break;
      }

      log(`Guardado en Wayback Machine: ${url}`, 'info');

      savedUrlsId.add(id);
    }

    if (savedUrlsId.size === 0) {
      log('No se han guardado URLs nuevos en Wayback Machine.', 'warn');
      return null;
    }

    return savedUrlsId;
  } catch (error) {
    log(`Error al guardar en Wayback Machine: ${error}`, 'error');
    return null;
  }
}
