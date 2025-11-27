import 'server-only';
import { log } from '../../../core/logger';
import { fetchParticipants } from '../repositories/participant.repo';
import { ParticipantsType } from '../types';

export async function getParticipants(
  cleanName: string,
  company: string
): Promise<ParticipantsType> {
  const fullName = cleanName.toLowerCase().split(' ');
  const partialName = fullName.slice(0, 2).join(' '); // nombre + primer apellido

  const { participants, error } = await fetchParticipants(partialName, company);

  if (error && !participants) {
    log(`Error al obtener el nombre o la compañia: ${error}`, 'error');
    return { participants: null, error };
  }

  // Mirar si hay algún registro con dos apellidos completos
  const hasFullSurname = participants.some((p) => p.name.split(' ').length > 2);

  // Si existen registros con dos apellidos → validar el segundo apellido correctamente
  if (hasFullSurname) {
    const inputSecondSurname = fullName[fullName.length - 1];

    const matchesSecondSurname = participants.some((participant) => {
      const parts = participant.name.toLowerCase().split(' ');

      if (parts.length > 2) {
        const realSecond = parts[parts.length - 1];
        return realSecond === inputSecondSurname;
      }

      return false;
    });

    if (!matchesSecondSurname) {
      log(
        'No se ha encontrado ningun participante coincidente (no coincide el apellido).',
        'debug'
      );
      return { participants: null, error: 'No matching participant found (surname mismatch)' };
    }
  }

  const filteredParticipants = participants.filter((participant) => {
    const parts = participant.name.toLowerCase().split(' ');
    if (parts.length <= 2) return true; // nombre + 1 apellido, se aceptan siempre

    // Se verifican que coincida el segundo apellido
    const realSecond = parts[parts.length - 1];
    const inputSecond = fullName[fullName.length - 1];
    return realSecond === inputSecond;
  });

  return { participants: filteredParticipants, error: null };
}
