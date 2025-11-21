'server-only';
import { NextResponse } from 'next/server';
import { getParticipant } from '../../logic/participants/getParticipant';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const company = searchParams.get('company');

    // Validar que se hayan proporcionado los parámetros
    if (!name || !company) {
      return NextResponse.json(
        { error: "Parametros 'name' y 'company' son obligatorios" },
        { status: 400 }
      );
    }

    // Normalizar nombre
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanName.split(' ').length < 3) {
      return NextResponse.json(
        { error: 'Por favor, proporciona al menos un nombre y dos apellidos' },
        { status: 400 }
      );
    }

    // Obtener estadísticas completas para el año y categoría especificados
    const participants = await getParticipant(cleanName, company);

    if (!participants || participants.length === 0) {
      return NextResponse.json(
        { message: `No hay datos para el participante ${name}` },
        { status: 404 }
      );
    }

    // Devuelve JSON limpio con las estadísticas del año
    return NextResponse.json({
      participants,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el estado del sistema', details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
