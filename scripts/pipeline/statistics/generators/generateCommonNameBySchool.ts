import { allParticipants } from '../../../pipeline/types';
import { commonNameBySchool } from '../statTypes';
import { groupBy } from '../../../logic/helpers';

// Generar el nombre más común por escuela
export function generateCommonNameBySchool(participants: allParticipants[]): commonNameBySchool[] {
  // Agrupar participantes por escuela
  const participantsBySchool = groupBy(participants, 'school');

  // Inicializar array para almacenar resultados
  const commonNameBySchool: commonNameBySchool[] = [];

  // Iterar sobre cada escuela y sus participantes
  for (const [school, schoolParticipants] of Object.entries(participantsBySchool)) {
    // Contar ocurrencias de nombres dentro de la escuela que se esta iterando
    const nameCounts = new Map<string, number>();

    // Iterar sobre participantes de la escuela
    for (const participant of schoolParticipants) {
      // Si no hay participante o nombre, saltar
      if (!participant.name) continue;

      // Limpiar y obtener el primer nombre
      const name = participant.name.split(' ')[0]; // Primer nombre
      const clean = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+/g, '')
        .trim();

      if (!clean) continue;

      // Contar el nombre
      nameCounts.set(clean, (nameCounts.get(clean) || 0) + 1);
    }

    // Si no hay nombres contados, saltar
    if (nameCounts.size === 0) continue;

    // Obtener el nombre más común y agregar al resultado
    const [commonName] = [...nameCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    commonNameBySchool.push({ school, name: commonName });
  }

  const sortedCommonNameBySchool = commonNameBySchool.sort((a, b) => {
    if (a.school < b.school) return -1;
    if (a.school > b.school) return 1;
    return 0;
  });

  return sortedCommonNameBySchool;
}
