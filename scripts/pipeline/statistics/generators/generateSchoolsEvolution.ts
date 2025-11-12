import { schoolsEvolution, topSchools } from '../statTypes';

// Generar la evolución de las escuelas a lo largo de los años
export function generateSchoolsEvolution(
  topSchoolsByYear: Record<number, topSchools[]>
): schoolsEvolution[] {
  // Agrupar resultados por escuela
  const schoolMap = new Map<string, { years: { year: number; count: number }[]; total: number }>();

  // Iterar sobre cada año y sus escuelas
  for (const [yearStr, schools] of Object.entries(topSchoolsByYear)) {
    // Obtener el año como número
    const year = parseInt(yearStr, 10);

    // Iterar sobre cada escuela en ese año
    for (const school of schools) {
      // Si la escuela no está en el mapa, inicializarla
      if (!schoolMap.has(school.school)) {
        schoolMap.set(school.school, { years: [], total: 0 });
      }

      // Agregar los datos del año actual a la escuela correspondiente
      const data = schoolMap.get(school.school)!;
      data.years.push({ year, count: school.count });
      data.total += school.count;
    }
  }

  // Convertir Map a array de schoolsEvolution y ordenar
  const results: schoolsEvolution[] = Array.from(schoolMap.entries()).map(([school, data]) => ({
    school,
    years: data.years,
    total: data.total,
  }));

  // Ordenar por total descendente
  const schoolsEvolution = results.sort((a, b) => b.total - a.total).slice(0, 250);

  return schoolsEvolution;
}
