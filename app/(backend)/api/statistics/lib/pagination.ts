import 'server-only';

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

/** Acota el tamaño de página: sin `limit` usa el valor por defecto y nunca supera el máximo. */
export function clampLimit(limit: number | null): number {
  return Math.min(limit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
}

/** Lo que aceptan todas las consultas paginadas por cursor. El cursor es opaco para el cliente. */
export interface CursorPageRequest {
  /** Tamaño de página ya acotado con `clampLimit` al validar la petición. */
  limit: number;
  cursor?: string;
}

/** `nextCursor` es `null` cuando ya se entregó la última página. */
export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

/**
 * Construye una página a partir de una consulta que pidió `limit + 1` filas: la fila extra solo
 * demuestra que existe una página siguiente y nunca se devuelve. El cursor se deriva de la última
 * fila que SÍ se devuelve, así la siguiente petición continúa justo después de ella.
 */
export function buildCursorPage<T>(
  rows: T[],
  limit: number,
  encodeCursor: (lastDelivered: T) => string
): CursorPage<T> {
  if (rows.length <= limit) {
    return { items: rows, nextCursor: null };
  }

  const items = rows.slice(0, limit);
  return { items, nextCursor: encodeCursor(items[items.length - 1] as T) };
}
