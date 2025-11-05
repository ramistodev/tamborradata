import { log } from '../helpers';
import { generateSummary } from './AI/generateSummary';
import {
  sysPromptGlobal,
  sysPromptIntro,
  sysPromptOutro,
  sysPromptYearly,
  userPromptGlobal,
  userPromptYearly,
  userPromptOutro,
  userPromptIntro,
} from './AI/prompt';
import { statEntry, summariesEntry } from './statTypes';

// Función para crear resúmenes estadísticos a partir de los datos recopilados
export async function makeSummaries(statistics: statEntry[]) {
  // Array para almacenar todos los resúmenes generados
  const allSummaries: summariesEntry[] = [];

  // Obtener años ordenados de cada stats
  const years = Object.keys(statistics[0].data)
    .map(Number)
    .sort((a, b) => a - b);

  // Procesar cada summary
  for (const stats of statistics) {
    // Procesar resúmenes por año
    if (stats.scope === 'yearly') {
      const dataContext: Record<number, any[]> = {}; // Inicializar contexto para cada stats

      // Procesar cada año de forma ordenada de menos a más reciente
      for (const year of years) {
        await new Promise((res) => setTimeout(res, 3500)); // 3.5 s entre llamadas para no sobrepasar límites de tokens de OpenAi

        // Obtener datos del año actual
        const data = stats.data[year];

        log('🧠 Procesando ' + stats.category + ' - Año ' + year, 'info');

        // Filtrar resúmenes por año para tener contexto de los resúmenes previos
        const summaryContext = allSummaries.filter((summary) => summary.year === year.toString());

        // Generar el prompt de usuario con el contexto actual
        const userPrompt = userPromptYearly(
          year,
          stats.category,
          data,
          dataContext,
          summaryContext
        );

        // Generar el resumen usando el prompt del sistema y el del usuario
        const summaryText = await generateSummary(sysPromptYearly, userPrompt);

        // Si no se generó texto, saltar
        if (!summaryText) {
          log(`No se generó texto para ${stats.category} (${year})`, 'warn');
          continue;
        }

        // Guardar el resumen generado
        allSummaries.push({
          category: stats.category,
          scope: stats.scope,
          year: year.toString(),
          summary: summaryText,
        });

        // Preparar el contexto para el siguiente año
        let contextData = data;

        // Solo procesar si es un array (no un número u otro tipo primitivo)
        if (Array.isArray(data)) {
          // Ordenar por count descendente
          contextData = data.slice().sort((a, b) => {
            if (a.year !== undefined && b.year !== undefined) {
              return b.year - a.year;
            }
            if (a.count !== undefined && b.count !== undefined) {
              return b.count - a.count;
            }
            return 0;
          });

          // Guardar solo los 15 primeros elementos para no sobrecargar el prompt
          contextData = contextData.slice(0, 15);
        }

        // Añadimos el contexto del año actual (puede ser array o primitivo)
        dataContext[year] = contextData;
      }
    }

    if (stats.scope === 'global') {
      await new Promise((res) => setTimeout(res, 3500)); // 3.5 s entre llamadas para no sobrepasar límites de tokens de OpenAi

      // Obtener datos globales
      const data = stats.data;

      log(`🧠 Procesando ${stats.category} - Resumen global`, 'info');

      // Filtrar resúmenes por año 'global' para tener contexto de los resúmenes previos
      const summaryContext = allSummaries.filter((summary) => summary.year === 'global');

      const yearRange = `${years[0]}-${years[years.length - 1]}`;

      // Generar el prompt de usuario para resumen global
      const userPrompt = userPromptGlobal(stats.category, yearRange, data, summaryContext);

      // Generar el resumen usando el prompt del sistema y el del usuario
      const summaryText = await generateSummary(sysPromptGlobal, userPrompt);

      // Si no se generó texto, saltar
      if (!summaryText) {
        log(`No se generó texto para ${stats.category} (global)`, 'warn');
        continue;
      }

      // Guardar el resumen generado
      allSummaries.push({
        category: stats.category,
        scope: stats.scope,
        year: 'global',
        summary: summaryText,
      });
    }
  }

  // Obtener todos los años únicos de los resúmenes generados
  const allSummaryYears = new Set<string>();
  for (const summary of allSummaries) {
    allSummaryYears.add(summary.year);
  }

  // Generar INTRO y OUTRO para cada año y global
  for (const year of allSummaryYears) {
    log(`Generando 'Intro' y 'Outro' para el año: ${year}`, 'info');

    await new Promise((res) => setTimeout(res, 3500)); // 3.5 s entre llamadas para no sobrepasar límites de tokens de OpenAi

    // Obtener todos los resúmenes del año actual
    const summariesContext = allSummaries.filter((s) => s.year === year);

    // Generar el resumen introductorio
    const intro = await generateSummary(sysPromptIntro, userPromptIntro(year, summariesContext));

    await new Promise((res) => setTimeout(res, 3500)); // 3.5 s entre llamadas para no sobrepasar límites de tokens de OpenAi

    // Generar el resumen conclusivo
    const outro = await generateSummary(sysPromptOutro, userPromptOutro(year, summariesContext));

    // Guardar los resúmenes generados
    allSummaries.push({
      category: 'intro',
      scope: year === 'global' ? 'global' : 'yearly',
      year: year.toString(),
      summary: intro,
    });

    allSummaries.push({
      category: 'outro',
      scope: year === 'global' ? 'global' : 'yearly',
      year: year.toString(),
      summary: outro,
    });
  }

  return allSummaries;
}
