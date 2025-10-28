// import { generateSummary } from './AI/generateSummary';
import { log } from '../helpers';
import { generateSummary } from './AI/generateSummary';
import { sysPromptGlobal, sysPromptYearly, userPromptGlobal, userPromptYearly } from './AI/prompt';
import { statEntry, summariesEntry } from './statTypes';

// Función para crear resúmenes estadísticos a partir de los datos recopilados
export async function makeSummaries(results: statEntry[]) {
  // Guardamos los resumenes generados por tipo
  const yearlySummaries = results.filter((entry) => entry.scope === 'yearly');
  const globalSummaries = results.filter((entry) => entry.scope === 'global');

  // Array para almacenar todos los resúmenes generados
  const allSummaries: summariesEntry[] = [];

  // Procesar cada summary
  for (const summary of [...yearlySummaries, ...globalSummaries]) {
    // Procesar resúmenes por año
    if (summary.scope === 'yearly') {
      const dataContext: Record<number, any[]> = {}; // Inicializar contexto para cada summary

      // Obtener años ordenados de cada summary
      const years = Object.keys(summary.data)
        .map(Number)
        .sort((a, b) => a - b);

      // Procesar cada año de forma ordenada de menos a más reciente
      for (const year of years) {
        await new Promise((res) => setTimeout(res, 3500)); // 3.5 s entre llamadas para no sobrepasar límites de tokens de OpenAi

        // Obtener datos del año actual
        const data = summary.data[year];

        log(
          '🧠 Procesando ' +
            summary.category +
            ' - Año ' +
            year +
            ' (contexto total: ' +
            Object.keys(dataContext).length +
            ' años)',
          'info'
        );

        // Generar el prompt de usuario con el contexto actual
        const userPrompt = userPromptYearly(year, summary.category, data, dataContext);

        // Generar el resumen usando el prompt del sistema y el del usuario
        const summaryText = await generateSummary(sysPromptYearly, userPrompt);

        // Si no se generó texto, saltar
        if (!summaryText) {
          log(`No se generó texto para ${summary.category} (${year})`, 'warn');
          continue;
        }

        // Guardar el resumen generado
        allSummaries.push({
          category: summary.category,
          scope: summary.scope,
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

          // Guardar solo los 10 primeros elementos para no sobrecargar el prompt
          contextData = contextData.slice(0, 10);
        }

        // Añadimos el contexto del año actual (puede ser array o primitivo)
        dataContext[year] = contextData;
      }
    }

    if (summary.scope === 'global') {
      await new Promise((res) => setTimeout(res, 3500)); // 3.5 s entre llamadas para no sobrepasar límites de tokens de OpenAi

      // Obtener datos globales
      const data = summary.data;

      log(`🧠 Procesando ${summary.category} - Resumen global`, 'info');

      // Generar el prompt de usuario para resumen global
      const userPrompt = userPromptGlobal(summary.category, data);

      // Generar el resumen usando el prompt del sistema y el del usuario
      const summaryText = await generateSummary(sysPromptGlobal, userPrompt);

      // Si no se generó texto, saltar
      if (!summaryText) {
        log(`No se generó texto para ${summary.category} (global)`, 'warn');
        continue;
      }

      // Guardar el resumen generado
      allSummaries.push({
        category: summary.category,
        scope: summary.scope,
        year: 'global',
        summary: summaryText,
      });
    }
  }

  return allSummaries;
}
