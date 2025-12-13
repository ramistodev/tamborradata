import 'server-only';
import { fetchParticipants } from '../repositories/participants.repo';
import { ParticipantsType } from '../types';
import { log } from '../../../core/logger';

export async function getParticipants(
  cleanName: string,
  company: string
): Promise<ParticipantsType> {
  const tokens = cleanName.trim().toLowerCase().split(/\s+/);
  const partialName = tokens.slice(0, 2).join(' '); // nombre + 1er apellido
  const inputSecond = tokens[tokens.length - 1]; // 2º apellido

  const { participants, error } = await fetchParticipants(partialName, company);

  if (error || !participants) {
    log(`Error al obtener el nombre o la compañia: ${error}`, 'error');
    return { participants: null, error };
  }

  // Agrupar por año
  const byYear = new Map<number, typeof participants>();
  for (const p of participants) {
    const arr = byYear.get(p.year) ?? [];
    arr.push(p);
    byYear.set(p.year, arr);
  }

  // Filtrar según segundo apellido
  const result = participants.filter((p) => {
    const parts = p.name.trim().toLowerCase().split(/\s+/);
    const isFull = parts.length > 2;

    // Caso 1: el registro tiene segundo apellido (mas de 2 palabras),
    // entonces deben de coincidir
    if (isFull) {
      const realSecond = parts[parts.length - 1];
      return realSecond === inputSecond;
    }

    // Caso 2: el registro no tiene 2º apellido (solo 2 palabras)
    // Regla: una persona no puede aparecer dos veces el mismo año.
    //
    // - Si existe un registro completo en ese año con ese 2º apellido, lo descartamos
    // - Si no existe, asumimos que la persona introducida es el registro incompleto, lo mantenemos
    // - Porque? Puede que en el registro falte el segundo apellido, lo cual que no sabemos y
    //   asumimos que ese nombre incompleto es el usuario que intenta buscarse a sí mismo porque
    //   no hay otro con el apellido que el a introducido
    const yearGroup = byYear.get(p.year) ?? [];
    const fullsSameYear = yearGroup.filter((x) => x.name.trim().split(/\s+/).length > 2);

    // Mirar si existe algún registro completo en ese mismo año
    // cuyo segundo apellido sea el metido por el usuario
    const anyFullMatchesInputSecond = fullsSameYear.some((x) => {
      const xs = x.name.trim().toLowerCase().split(/\s+/);
      return xs[xs.length - 1] === inputSecond;
    });

    return !anyFullMatchesInputSecond;
  });

  // Si no hay coincidencias se devuelve error específico
  if (inputSecond && result.length === 0) {
    log('No se ha encontrado ningun participante coincidente (no coincide el apellido).', 'debug');
    return { participants: null, error: 'No matching participant found (surname mismatch)' };
  }

  return { participants: result, error: null };
}
