import { allParticipants } from '../../types';
import { topNames } from '../statTypes';

// Generar los nombres más comunes
export function generateTopNames(participants: allParticipants[]): {
  topNames: topNames[];
  namesDiversity: number;
} {
  // Contar ocurrencias de nombres
  const nameCounts = new Map<string, number>();

  // Iterar sobre participantes
  for (const participant of participants) {
    // Si no hay participante o nombre, saltar
    if (!participant.name) continue;

    // Limpiar y obtener el primer nombre
    const name = participant.name.split(' ')[0]; // Contar solo el primer nombre
    const clean = name
      .normalize('NFD') // eliminar acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+/g, '') // quitar símbolos
      .trim();

    if (!clean) continue;

    // Contar el nombre
    const currentCount = nameCounts.get(clean) || 0;
    nameCounts.set(clean, currentCount + 1);
  }

  // Convertir Map a array de objetos topNames
  const results: topNames[] = Array.from(nameCounts.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  // Calcular la diversidad de nombres
  const namesDiversity = results.length;

  // Ordenar por orden descendente y tomar los top 50
  const topNames = results.sort((a, b) => b.count - a.count).slice(0, 250);

  return { topNames, namesDiversity };
}
