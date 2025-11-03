import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo aplicamos el middleware a rutas /api
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');
  const userAgent = req.headers.get('user-agent') || '';

  // Entornos permitidos
  const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
  const isProduction = host?.includes('tamborradata.com');
  const isVercel = host?.includes('vercel.app');

  // Orígenes permitidos para peticiones CORS
  const allowedOrigins = [
    'https://tamborradata.com',
    'https://www.tamborradata.com',
    'http://localhost:3000',
    'https://localhost:3000',
  ];

  // Detectar si es un navegador accediendo directamente
  const isDirectBrowserAccess = !origin && !referer && userAgent.includes('Mozilla');

  // Verificar si es una petición válida del frontend
  const isValidOrigin = origin && allowedOrigins.includes(origin);
  const isValidReferer = referer && allowedOrigins.some((allowed) => referer.startsWith(allowed));

  // BLOQUEAR acceso directo desde navegador
  if (isDirectBrowserAccess) {
    return new NextResponse('Not found', { status: 404 });
  }

  // PERMITIR solo si viene del frontend
  if ((isLocalhost || isProduction || isVercel) && (isValidOrigin || isValidReferer)) {
    console.log('[Middleware] Acceso permitido desde frontend');
    return NextResponse.next();
  }
  return new NextResponse('Not found', { status: 404 });
}

export const config = {
  matcher: ['/api/:path*'],
};
