import { allParticipants } from '../../../pipeline/types';
import { topSchools } from '../statTypes';

// Generar las escuelas más comunes
export function generateTopSchools(participants: allParticipants[]): topSchools[] {
  // Mapa para contar ocurrencias de escuelas
  const schoolCounts = new Map<string, number>();

  // Contar ocurrencias de escuelas
  for (const participant of participants) {
    if (!participant.school) continue;
    const school = participant.school.trim();
    schoolCounts.set(school, (schoolCounts.get(school) || 0) + 1);
  }

  // Convertir el Map a un array de topSchools
  const topSchools: topSchools[] = Array.from(schoolCounts.entries()).map(([school, count]) => ({
    school,
    count,
  }));

  const sortedTopSchools = topSchools.sort((a, b) => b.count - a.count).slice(0, 250);

  return sortedTopSchools;
}
