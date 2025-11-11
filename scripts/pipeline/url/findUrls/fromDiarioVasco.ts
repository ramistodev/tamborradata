import { load } from 'cheerio';
import { log } from '../../../logic/helpers';

export async function fromDiarioVasco(): Promise<string[]> {
  // URL base de Diario Vasco para las compañías infantiles de la Tamborrada
  const BASEURL = 'https://www.diariovasco.com/tamborrada/companias/infantiles/';

  try {
    // Hacemos una petición fetch para verificar que la URL es accesible
    const res = await fetch(BASEURL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!res.ok) {
      log(`Diario Vasco returned HTTP status ${res.status}`, 'error');
      return [];
    }

    const html = await res.text();

    const $ = load(html);

    const collectedUrls: string[] = [];

    const articleLinks = $('a').toArray();

    articleLinks.forEach((element) => {
      const href = $(element).attr('href');
      if (href && href.endsWith('.html') && href.includes('/tamborrada/companias/infantiles/')) {
        collectedUrls.push(href);
      }
    });

    return collectedUrls;
  } catch (error) {
    log(`Error fetching from Diario Vasco: ${JSON.stringify(error, null, 2)}`, 'error');
    return [];
  }
}
