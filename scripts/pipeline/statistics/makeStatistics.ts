import { groupBy, log } from '../../logic/helpers';
import { getYears } from './getYears';
import { getAllParticipants } from './getAllParticipants';
import { generateTopNames } from './generators/generateTopNames';
import { generateTopSurnames } from './generators/generateTopSurnames';
import { generateTopSchools } from './generators/generateTopSchools';
import { generateTotalParticipants } from './generators/generateTotalParticipants';
import { generateCommonNameBySchool } from './generators/generateCommonNameBySchool';
import { allParticipants } from '../../pipeline/types';
import { generateSchoolsEvolution } from './generators/generateSchoolsEvolution';
import { generateNewNamesByYear } from './generators/generateNewNamesByYear';
import type {
  commonNameBySchool,
  totalParticipants,
  topNames,
  topSchools,
  topSurnames,
  statEntry,
} from './statTypes';

// Función principal para generar todas las estadísticas
export async function makeStatistics(): Promise<statEntry[]> {
  // Obtener años disponibles
  const availableYears = await getYears();
  const firstYear = availableYears[0];

  // Si no hay años, retornar vacío
  if (availableYears.length === 0) {
    log('⚠️ No se encontraron años disponibles en la base de datos.', 'warn');
    return [];
  }

  log(`Años disponibles para estadísticas: ${availableYears.join(', ')}`, 'info');

  // Obtener todos los participantes
  const allParticipants: allParticipants[] = await getAllParticipants();
  // Agrupar participantes por año
  const yearGroups = groupBy(allParticipants, 'year');

  // Inicializar estructuras para estadísticas por año
  const topNamesByYear: Record<number, topNames[]> = {};
  const namesDiversityByYear: Record<number, number> = {};
  const topSurnamesByYear: Record<number, topSurnames[]> = {};
  const surnamesDiversityByYear: Record<number, number> = {};
  const topSchoolsByYear: Record<number, topSchools[]> = {};
  const totalParticipantsByYear: Record<number, totalParticipants[]> = {};
  const commonNameBySchoolByYear: Record<number, commonNameBySchool[]> = {};

  // Generar estadísticas por año, hacemos una pasada por cada año
  for (const year of availableYears) {
    // Obtener participantes del año
    const participants = yearGroups[year] || [];

    // Si hay participantes, generar estadísticas
    if (participants.length > 0) {
      log(`Generando estadísticas para el año ${year}...`, 'info');

      // Generar estadísticas específicas
      const { topNames, namesDiversity } = generateTopNames(participants); // Top nombres y diversidad

      const { topSurnames, surnamesDiversity } = generateTopSurnames(participants); // Top apellidos y diversidad

      const topSchools = generateTopSchools(participants); // Top escuelas

      const totalParticipants = generateTotalParticipants(participants); // Total participantes

      const commonNameBySchool = generateCommonNameBySchool(participants); // Nombre más común por escuela

      // Almacenar estadisticas en las estructuras correspondientes
      topNamesByYear[year] = topNames;
      namesDiversityByYear[year] = namesDiversity;
      topSurnamesByYear[year] = topSurnames;
      surnamesDiversityByYear[year] = surnamesDiversity;
      topSchoolsByYear[year] = topSchools;
      totalParticipantsByYear[year] = totalParticipants;
      commonNameBySchoolByYear[year] = commonNameBySchool;
    }
  }

  // Generar estadísticas globales
  const { topNames, namesDiversity } = generateTopNames(allParticipants); // Top nombres y diversidad

  const { topSurnames, surnamesDiversity } = generateTopSurnames(allParticipants); // Top apellidos y diversidad

  const topSchools = generateTopSchools(allParticipants); // Top escuelas

  const schoolsEvolution = generateSchoolsEvolution(topSchoolsByYear); // Evolución de escuelas

  const totalParticipants = generateTotalParticipants(allParticipants); // Total participantes

  // Escuelas más constantes
  const mostConstantSchools = schoolsEvolution
    .sort((a, b) => b.years.length - a.years.length)
    .map((school) => ({
      school: school.school,
      yearsActive: school.years,
    }))
    .slice(0, 250);

  const newSchoolsByYear: Record<number, { school: string }[]> = {}; // Nuevas escuelas por año

  for (const school of schoolsEvolution) {
    const firstAppearance = school.years[0].year;
    if (firstAppearance === firstYear) continue;

    if (!newSchoolsByYear[firstAppearance]) {
      newSchoolsByYear[firstAppearance] = [];
    }
    newSchoolsByYear[firstAppearance].push({ school: school.school });
  }

  const commonNameBySchool = generateCommonNameBySchool(allParticipants); // Nombre más común por escuela globalmente

  const newNamesByYear = generateNewNamesByYear(allParticipants, firstYear); // Nombres únicos por año

  // Los nombres mas largos
  const longestNames = Array.from(new Set(allParticipants.map((p) => p.name.split(' ')[0])))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .slice(0, 50);

  log('Generación de estadísticas completada.\n', 'info');

  // Compilar todas las estadísticas en un solo array para posterior almacenamiento
  const statistics: statEntry[] = [
    { category: 'topNamesByYear', scope: 'yearly', data: topNamesByYear },
    { category: 'namesDiversityByYear', scope: 'yearly', data: namesDiversityByYear },
    { category: 'topNames', scope: 'global', data: topNames },
    { category: 'namesDiversity', scope: 'global', data: namesDiversity },
    { category: 'topSurnamesByYear', scope: 'yearly', data: topSurnamesByYear },
    { category: 'surnamesDiversityByYear', scope: 'yearly', data: surnamesDiversityByYear },
    { category: 'topSurnames', scope: 'global', data: topSurnames },
    { category: 'surnamesDiversity', scope: 'global', data: surnamesDiversity },
    { category: 'topSchoolsByYear', scope: 'yearly', data: topSchoolsByYear },
    { category: 'topSchools', scope: 'global', data: topSchools },
    { category: 'totalParticipantsByYear', scope: 'yearly', data: totalParticipantsByYear },
    { category: 'totalParticipants', scope: 'global', data: totalParticipants },
    { category: 'commonNameBySchoolByYear', scope: 'yearly', data: commonNameBySchoolByYear },
    { category: 'newSchoolsByYear', scope: 'yearly', data: newSchoolsByYear },
    { category: 'newNamesByYear', scope: 'yearly', data: newNamesByYear },
    { category: 'commonNameBySchool', scope: 'global', data: commonNameBySchool },
    { category: 'schoolsEvolution', scope: 'global', data: schoolsEvolution },
    { category: 'mostConstantSchools', scope: 'global', data: mostConstantSchools },
    { category: 'longestNames', scope: 'global', data: longestNames },
  ];

  return statistics;
}
