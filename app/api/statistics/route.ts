import { getStatistics } from '@/app/logic/statistics/getStatistics';
import { groupBy } from '@/scripts/logic/helpers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const year = new URL(req.url).searchParams.get('year');
  if (!year) return NextResponse.json({ error: "Parametro 'year' obligatorio" }, { status: 400 });

  const stats = await getStatistics(year);

  if (!stats?.length || !stats)
    return NextResponse.json({ message: `No hay datos ${year}` }, { status: 404 });

  const statisticsByCategory = groupBy(stats, 'category');

  // Devuelve JSON limpio con las estadísticas del año
  return NextResponse.json({
    year,
    total_categories: stats.length,
    statistics: statisticsByCategory,
  });
}
