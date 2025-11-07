import { getSysStatus } from '../../logic/sysStatus/getSysStatus';
import { NextResponse } from 'next/server';

export async function GET() {
  const sysStatus = await getSysStatus();
  if (!sysStatus)
    return NextResponse.json({ error: 'No se encontró información del sistema' }, { status: 404 });

  return NextResponse.json(sysStatus);
}
