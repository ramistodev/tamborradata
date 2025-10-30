import { getAvailableYears } from '@/app/(backend)/logic/years/getAvailableYears';
import { NextResponse } from 'next/server';

export async function GET() {
  const years = await getAvailableYears();
  if (!years || years.length === 0)
    return NextResponse.json({ error: 'No se encontraron años disponibles' }, { status: 404 });

  return NextResponse.json({ years });
}
