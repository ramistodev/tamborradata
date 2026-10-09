import 'server-only';

/**
 * Límites de la vista previa que sirve el endpoint principal de estadísticas. La base de datos
 * conserva todo el histórico: estos límites solo acotan lo que se lee para la página inicial, de
 * modo que su tamaño no crece por más periodos que se publiquen. El endpoint de detalle de
 * categoría sirve el resto.
 *
 * - `PREVIEW_RANKS`: posiciones de un ranking global.
 * - `PREVIEW_ENTITIES` / `PREVIEW_PERIODS`: entidades y últimos periodos de una serie.
 * - `PREVIEW_SCHOOLS`: colegios de una serie por colegio (los que participaron en más ediciones de
 *   la ventana). Aparte de `PREVIEW_ENTITIES` para poder ajustarlo sin tocar las series de nombres.
 * - `PREVIEW_GROUPS`: colegios de un ranking agrupado por colegio (un puesto 1 por colegio).
 */
export const PREVIEW_RANKS = 10;
export const PREVIEW_ENTITIES = 10;
export const PREVIEW_PERIODS = 10;
export const PREVIEW_SCHOOLS = 10;
export const PREVIEW_GROUPS = 10;
