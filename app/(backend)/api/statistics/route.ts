import { getStatistics } from '@/app/(backend)/logic/statistics/getStatistics';
import { groupBy } from '@/app/(backend)/logic/helpers/groupBy';
import { NextResponse } from 'next/server';
import { VALID_YEARS } from '../../utils/constants';

export async function GET(req: Request) {
  try {
    const year = new URL(req.url).searchParams.get('year');

    // Validar que se hayan proporcionado los parámetros
    if (!year) {
      return NextResponse.json({ error: "Parametro 'year' es obligatorio" }, { status: 400 });
    }

    // Validar formato de year
    if (year !== 'global' && !/^\d{4}$/.test(year)) {
      return NextResponse.json({ error: 'Formato de año inválido' }, { status: 400 });
    }

    // Validar año
    const validYears: string[] = await VALID_YEARS();
    if (!validYears.includes(year)) {
      return NextResponse.json(
        { error: `Año inválido. Años válidos: ${validYears.slice(0, 4).join(', ')}, ...` },
        { status: 400 }
      );
    }

    // Obtener estadísticas completas para el año especificado
    const stats = await getStatistics(year);

    // Validar si hay datos
    if (!stats?.length || !stats) {
      return NextResponse.json({ message: `No hay datos ${year}` }, { status: 404 });
    }

    // Agrupar estadísticas por categoría
    const statisticsByCategory = groupBy(stats, 'category');

    // Devuelve JSON limpio con las estadísticas del año
    return NextResponse.json({
      year,
      total_categories: stats.length,
      statistics: statisticsByCategory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
