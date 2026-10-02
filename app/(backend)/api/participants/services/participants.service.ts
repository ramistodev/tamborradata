import 'server-only';
import { fetchParticipants } from '../repositories/participants.repo';
import { ParticipantRow } from '../types';
import { NotFoundError } from '../../../lib/errors';
import { ParticipantsResponse } from '../../../../types/api/participants.types';

export async function participantsService(
  cleanName: string,
  schoolKey: string
): Promise<ParticipantsResponse[]> {
  const tokens = cleanName.trim().toLowerCase().split(/\s+/);
  const partialName = tokens.slice(0, 2).join(' '); // nombre + 1er apellido
  const inputSecond = tokens[tokens.length - 1]; // 2º apellido

  const participants = await fetchParticipants(partialName, schoolKey);

  const formatedParticipants = participants.map((p) => toParticipant(p));

  // Agrupar por año
  const byYear = new Map<number, typeof formatedParticipants>();
  for (const p of formatedParticipants) {
    const arr = byYear.get(p.year) ?? [];
    arr.push(p);
    byYear.set(p.year, arr);
  }

  // Filtrar según segundo apellido
  const result = formatedParticipants.filter((p) => {
    const parts = p.nameKey.trim().toLowerCase().split(/\s+/); // Hace split del nombre completo en palabras
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
    const fullsSameYear = yearGroup.filter((x) => x.nameKey.trim().split(/\s+/).length > 2);

    // Mirar si existe algún registro completo en ese mismo año
    // cuyo segundo apellido sea el metido por el usuario
    const anyFullMatchesInputSecond = fullsSameYear.some((x) => {
      const xs = x.nameKey.trim().toLowerCase().split(/\s+/);
      return xs[xs.length - 1] === inputSecond;
    });

    return !anyFullMatchesInputSecond;
  });

  // Si no hay coincidencias se devuelve error específico
  if (inputSecond && result.length === 0) {
    throw new NotFoundError("Don't match any participant with the second last name provided");
  }

  return result;
}

function toParticipant(row: ParticipantRow): ParticipantsResponse {
  return {
    id: row.id,
    name: row.name,
    nameKey: row.name_key,
    year: row.year,
    school: {
      schoolId: row.school.id,
      canonicalName: row.school.canonical_name,
      schoolKey: row.school.school_key,
    },
    url: row.scraped_url?.url ?? '',
  };
}
