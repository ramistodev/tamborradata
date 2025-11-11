import { log } from '../helpers';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { cleanSchoolName, isValidName, cleanNames } from './participantsUtils';
import * as chrono from 'chrono-node';
import { allParticipants, pageParticipants, updateUrls } from '../types';
import { getUrls } from './getUrls';

// Lógica para recoger los participantes desde las URLs scrapeandolas
export async function scrapParticipants(): Promise<{
  allParticipants: Set<allParticipants>;
  scrapedUrls: Set<updateUrls>;
}> {
  // Recuperamos las URLs no scrapeadas para procesarlas
  const urlsData = await getUrls();

  // Si no hay URLs, devolvemos sets vacíos
  if (!urlsData || urlsData.length === 0) {
    log('No URLs found', 'info');
    return { allParticipants: new Set<allParticipants>(), scrapedUrls: new Set<updateUrls>() };
  }

  // Sets para almacenar URLs procesados y participantes recogidos
  const scrapedUrls: Set<updateUrls> = new Set<updateUrls>();
  const allParticipants: Set<allParticipants> = new Set<allParticipants>();

  // Procesamos cada URL
  for (const { url, id } of urlsData) {
    // Scrapeamos la página
    const results: pageParticipants[] = await scrapePage(url);
    // Actualizamos la ID de la URL procesada
    scrapedUrls.add({ id, article_date: results[0]?.article_date });

    // Añadimos los participantes recogidos al Set principal
    for (const participant of results) {
      const year = participant.article_date.split('/')[0];
      allParticipants.add({
        ...participant,
        url_id: id,
        year: parseInt(year, 10),
      });
    }
  }

  return { allParticipants, scrapedUrls };
}

// Función para scrapear una página y extraer participantes
async function scrapePage(url: string): Promise<pageParticipants[]> {
  // Hacemos la petición HTTP para obtener el HTML de la página
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    // Extraemos el HTML de la respuesta
    const html = await res.text();
    // Cargamos el HTML con cheerio para su análisis
    const $ = load(html);

    // Aqui guardamos cada participante encontrado
    const allResults: pageParticipants[] = [];

    // Extraemos el nombre de la escuela
    const schoolTag = $('h1.v-a-t').first().text().trim() || 'UNKNOWN SCHOOL';
    const school = cleanSchoolName(schoolTag);

    // Extraemos la fecha del artículo
    const dateTag = $('p.v-mdl-ath__p.v-mdl-ath__p--6').first();
    let unformattedDate = '0000/00/00';

    // Extraemos el texto de la fecha, eliminando cualquier etiqueta <time> si existe
    if (dateTag.length) {
      const clonedTag = dateTag.clone();
      clonedTag.find('time').remove();
      unformattedDate = clonedTag.text().trim();
    } else {
      const clonedTag = dateTag.clone();
      clonedTag.find('time').remove();
      unformattedDate = clonedTag.text().trim();
    }

    // Formateamos la fecha al formato YYYY/MM/DD usando chrono-node
    let article_date = '0000/00/00';
    if (unformattedDate && unformattedDate !== '0000/00/00') {
      const parsed = chrono.es.parseDate(unformattedDate);
      if (parsed) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const day = String(parsed.getDate()).padStart(2, '0');
        article_date = `${year}/${month}/${day}`;
      }
    }

    // Extraemos los párrafos que contienen los nombres de los participantes
    const paragraphs = $('p.v-p').toArray();

    // Procesamos cada párrafo para extraer nombres válidos
    for (const p of paragraphs) {
      // Limpiamos el texto del párrafo quitando tildes y otros caracteres
      const text = cleanNames($(p).text().trim());

      // Verificamos que el texto tenga al menos 3 caracteres y que la primera palabra tenga más de 2 caracteres
      if (text.length < 3) continue;
      const firstWord = text.split(' ')[0];
      if (firstWord.length <= 2) continue;
      if (!isValidName(text)) continue;

      allResults.push({
        name: text,
        school,
        article_date,
      });
    }

    return allResults;
  } catch (error) {
    log(`Error fetching URL ${url}: ${JSON.stringify(error, null, 2)}`, 'error');
    return [];
  }
}
