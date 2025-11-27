import 'server-only';
import { NextResponse } from 'next/server';
import { checkParams } from './dtos/participant.schema';
import { getParticipants } from './services/participant.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const company = searchParams.get('company');

    const { valid, cleanName, error: paramError } = await checkParams(name, company);

    if (!valid) {
      return NextResponse.json({ error: paramError }, { status: 400 });
    }

    // Obtener estadísticas completas para el año y categoría especificados
    const { participants, error: serviceError } = await getParticipants(cleanName, company);

    if (serviceError && !participants) {
      return NextResponse.json({ error: serviceError }, { status: 500 });
    }

    // Devuelve JSON limpio con las estadísticas del año
    return NextResponse.json({
      participants,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: error },
      { status: 500 }
    );
  }
}
