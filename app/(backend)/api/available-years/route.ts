import { getAvailableYears } from '@/app/(backend)/logic/years/getAvailableYears';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener los años disponibles
    const years: number[] | null = await getAvailableYears();

    // Devuelve JSON limpio con los años disponibles
    return NextResponse.json({ years: years || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
