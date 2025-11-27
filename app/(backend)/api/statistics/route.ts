import 'server-only';
import { NextResponse } from 'next/server';
import { getStatistics } from './services/statistics.service';
import { getSysStatus } from '../../shared/utils/getSysStatus';
import { checkParams } from './dtos/statistics.schema';

export async function GET(req: Request) {
  try {
    const year = new URL(req.url).searchParams.get('year');

    // Validar parámetro 'year'
    const { valid, cleanYear, error: paramError } = await checkParams(year);

    if (!valid) {
      return NextResponse.json({ error: paramError }, { status: 400 });
    }

    // Obtener estado del sistema
    const isUpdating: boolean = await getSysStatus();

    // Obtener estadísticas completas para el año especificado
    const { statistics, error } = await getStatistics(cleanYear);

    if (error && !statistics) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Devuelve JSON limpio con las estadísticas del año
    return NextResponse.json({
      isUpdating,
      year: cleanYear,
      total_categories: statistics ? Object.keys(statistics).length : 0,
      statistics,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: error },
      { status: 500 }
    );
  }
}
