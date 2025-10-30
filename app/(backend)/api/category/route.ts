import { getFullStatistics } from '@/app/(backend)/logic/statistics/getFullStatistics';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const category = searchParams.get('category');

  if (!year || !category) {
    return NextResponse.json(
      { error: "Parametros 'year' o 'category' son obligatorios" },
      { status: 400 }
    );
  }

  const stats = await getFullStatistics(year, category);

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
}
