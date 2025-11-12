import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo aplicamos el middleware a rutas /api
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const referer = req.headers.get('referer');
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  const userAgent = req.headers.get('user-agent') || '';

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
    // Permitir requests SSR de Next.js
    if (userAgent.includes('Next.js') || userAgent.includes('node')) {
      return NextResponse.next();
    }

    // Verificar origin
    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (originHost === host) {
          return NextResponse.next();
        }
      } catch {
        // Origin inválido
      }
    }

    // Verificar referer
    if (referer) {
      try {
        const refererHost = new URL(referer).host;
        if (refererHost === host) {
          return NextResponse.next();
        }
      } catch {
        // Referer inválido
      }
    } else return new NextResponse('Not found', { status: 404 });

    // Si no pasa las verificaciones, bloquear
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Por defecto, no permitir ← Entorno desconocido, no se deberia de ejecutarse
  return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
