import { allParticipants } from '../../../pipeline/types';

// Generar los nombres que salen por primera vez cada año
export function generateNewNamesByYear(
  participants: allParticipants[],
  firstYear: number
): Record<number, string[]> {
  // Agrupar nombres por año
  const namesByYear: Record<number, string[]> = {};

  // Iterar sobre participantes
  for (const participant of participants) {
    // Si no hay participante, año o nombre, saltar
    if (!participant || !participant.year || !participant.name) continue;

    // Obtener el año y el nombre limpio
    const year = Number(participant.year);

    const name = participant.name.split(' ')[0];
    const clean = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+/g, '')
      .trim();

    if (!clean) continue;

    // Inicializar array para el año si no existe
    if (!namesByYear[year]) {
      namesByYear[year] = [];
    }

    // Agregar el nombre limpio al año correspondiente
    namesByYear[year].push(clean);
  }

  // Años ordenados ascendentemente
  const years = Object.keys(namesByYear)
    .map((y) => parseInt(y, 10))
    .sort((a, b) => a - b);

  // Conjunto para nombres ya vistos
  const seenNames = new Set<string>();

  // Agregar los nombres del primer año al conjunto de vistos ya que esos no se cuentan como nuevos
  for (const name of namesByYear[firstYear]) {
    seenNames.add(name);
  }

  // Resultado final
  const uniqueNamesByYear: Record<number, string[]> = {};

  // Iterar sobre los años
  for (const year of years) {
    // Saltar el primer año si es el primero ya que si no contaria que todos son nuevos
    if (year === firstYear) continue;

    // Obtener los nombres de este año
    const namesThisYear = namesByYear[year];

    // Nuevo array para nombres únicos de este año
    const newNames: string[] = [];

    // Iterar sobre los nombres de este año
    for (const name of namesThisYear) {
      // Si el nombre no ha sido visto antes, es nuevo
      if (!seenNames.has(name)) {
        newNames.push(name);
        seenNames.add(name);
      }
    }

    // Si no hay nuevos nombres, continuar
    if (newNames.length === 0) continue;

    // Asignar los nuevos nombres al año correspondiente
    uniqueNamesByYear[year] = newNames;
  }

  return uniqueNamesByYear;
}
