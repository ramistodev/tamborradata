import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo aplicamos el middleware a rutas /api
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  // Entornos permitidos
  const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
  const isProduction = host?.includes('tamborradata.com');
  const isVercel = host?.includes('vercel.app');

  // En entorno de desarrollo (localhost), permitir todas las peticiones
  if (isLocalhost) {
    return NextResponse.next();
  }

  // En producción y Vercel, verificar que venga del mismo dominio
  if (isProduction || isVercel) {
    // Si no hay referer, es acceso directo desde navegador - BLOQUEAR
    if (!referer) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Verificar que el referer sea del mismo dominio
    const refererHost = new URL(referer).host;
    if (refererHost === host) {
      return NextResponse.next();
    }

    // Bloquear si viene de otro dominio
    return new NextResponse('Not found', { status: 404 });
  }

  // Por defecto, permitir
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
