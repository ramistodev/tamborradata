import 'server-only';
import { NextResponse } from 'next/server';
import { getCompanies } from './services/companies.service';

export async function GET() {
  try {
    // Obtener los años disponibles
    const { companies, error } = await getCompanies();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Manejar caso de no encontrar compañías
    if (!companies) {
      return NextResponse.json(
        { error: 'No se encontraron compañías disponibles' },
        { status: 404 }
      );
    }

    // Devuelve JSON limpio con los años disponibles
    return NextResponse.json({ companies: companies || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
