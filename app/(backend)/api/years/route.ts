import 'server-only';
import { NextResponse } from 'next/server';
import { getYears } from './services/years.service';

export async function GET() {
  try {
    // Obtener los años disponibles
    const { years, error } = await getYears();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!years) {
      return NextResponse.json({ error: 'No se encontraron años disponibles' }, { status: 404 });
    }

    // Devuelve JSON limpio con los años disponibles
    return NextResponse.json({ years: years });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
