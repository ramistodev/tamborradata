import { getSysStatus } from '../../logic/sysStatus/getSysStatus';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener el estado del sistema
    const sysStatus = await getSysStatus();

    // Validar si hay datos
    if (!sysStatus) {
      return NextResponse.json(
        { error: 'No se encontró información del sistema' },
        { status: 404 }
      );
    }

    return NextResponse.json(sysStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
