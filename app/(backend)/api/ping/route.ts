// app/api/ping/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({
    ok: true,
    message: 'Tamborradata API funcionando 🎉',
  });

  return res;
}
