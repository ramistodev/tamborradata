import { getFullStatistics } from '@/app/(backend)/logic/statistics/getFullStatistics';
import { NextResponse } from 'next/server';
import { VALID_CATEGORIES, VALID_YEARS } from '../../utils/constants';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const category = searchParams.get('category');

    // Validar que se hayan proporcionado los parámetros
    if (!year || !category) {
      return NextResponse.json(
        { error: "Parametros 'year' y 'category' son obligatorios" },
        { status: 400 }
      );
    }

    // Validar categoria
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Categoría inválida. Esa categoria no existe' },
        { status: 400 }
      );
    }

    // Validar formato de year
    if (year !== 'global' && !/^\d{4}$/.test(year)) {
      return NextResponse.json({ error: 'Formato de año inválido' }, { status: 400 });
    }

    // Validar año y categoria
    const validYears: string[] = await VALID_YEARS();
    if (!validYears.includes(year)) {
      return NextResponse.json(
        { error: `Año inválido. Años válidos: ${validYears.slice(0, 4).join(', ')}, ...` },
        { status: 400 }
      );
    }

    // Obtener estadísticas completas para el año y categoría especificados
    const stats = await getFullStatistics(year, category);

    // Validar si hay datos
    if (!stats || stats.length === 0) {
      return NextResponse.json(
        { message: `No hay datos para el año ${year} o la categoría ${category}` },
        { status: 404 }
      );
    }

    // Devuelve JSON limpio con las estadísticas del año
    return NextResponse.json({
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
