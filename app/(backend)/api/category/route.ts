import 'server-only';
import { NextResponse } from 'next/server';
import { checkParams } from './dtos/category.schema';
import { getCategory } from './services/category.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const category = searchParams.get('category');

    const {
      valid,
      cleanYear,
      cleanCategory,
      error: paramError,
    } = await checkParams(year, category);

    if (!valid && !cleanYear && !cleanCategory && paramError) {
      return NextResponse.json({ error: paramError }, { status: 400 });
    }

    const { category: stats, error: serviceError } = await getCategory(cleanYear, cleanCategory);

    if (serviceError && !stats) {
      return NextResponse.json({ error: serviceError }, { status: 500 });
    }

    // Devuelve JSON limpio con las estadísticas del año
    return NextResponse.json({
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: error },
      { status: 500 }
    );
  }
}
