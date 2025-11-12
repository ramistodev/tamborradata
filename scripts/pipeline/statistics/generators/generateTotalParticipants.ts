import { allParticipants } from '../../../pipeline/types';
import { totalParticipants } from '../statTypes';

// Generar el total de participantes por año
export function generateTotalParticipants(participants: allParticipants[]): totalParticipants[] {
  // Mapa para contar participantes por año
  const participantCount = new Map<number, number>();

  // Contar participantes por año
  for (const participant of participants) {
    // Si no hay participante o año, saltar
    if (!participant || !participant.year) continue;

    // Obtener el año y contar
    const year = Number(participant.year);

    // Contar el participante
    const currentCount = participantCount.get(year) || 0;
    participantCount.set(year, currentCount + 1);
  }

  // Convertir el Map a un array de totalParticipants
  const totalParticipants: totalParticipants[] = Array.from(participantCount.entries()).map(
    ([year, count]) => ({
      year,
      count,
    })
  );

  const sortedTotalParticipants = totalParticipants.sort((a, b) => a.year - b.year);

  return sortedTotalParticipants;
}
