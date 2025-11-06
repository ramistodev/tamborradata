import { allParticipants } from '../../../pipeline/types';
import { topSurnames } from '../statTypes';

// Generar los apellidos más comunes
export function generateTopSurnames(participants: allParticipants[]): {
  topSurnames: topSurnames[];
  surnamesDiversity: number;
} {
  // Contar ocurrencias de apellidos
  const surnameCounts = new Map<string, number>();

  // Contar ocurrencias de apellidos
  for (const participant of participants) {
    // Si no hay participante o nombre, saltar
    if (!participant.name) continue;

    // Obtener los apellidos (considerando todo menos el primer nombre)
    const parts = participant.name.trim().split(/\s+/);
    if (parts.length < 2) continue; // no tiene apellido

    // Todo menos el primer nombre → solo apellidos
    const onlySurnames = parts.slice(1);

    // Limpiar y contar los apellidos que puede tener un participante
    for (const surname of onlySurnames) {
      const clean = surname
        .normalize('NFD') // eliminar acentos
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+/g, '') // quitar símbolos
        .replace(/\b(de|De|la|La|del|Del|san|San)\b/g, '') // quitar artículos y preposiciones
        .trim();

      if (!clean) continue;

      // Contar el apellido
      const count = surnameCounts.get(clean) || 0;
      surnameCounts.set(clean, count + 1);
    }
  }

  // Convertir Map a array de objetos topSurnames
  const results: topSurnames[] = Array.from(surnameCounts.entries()).map(([surname, count]) => ({
    surname,
    count,
  }));

  // Calcular la diversidad de apellidos
  const surnamesDiversity = results.length;

  // Ordenar por orden descendente y tomar los top 50
  const topSurnames = results.sort((a, b) => b.count - a.count).slice(0, 250);

  return { topSurnames, surnamesDiversity };
}
