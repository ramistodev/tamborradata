import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo aplicamos el middleware a rutas /api
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  console.log('[Middleware] Origin:', origin, '| Referer:', referer, '| Host:', host);

  // Entornos permitidos
  const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
  const isProduction = host?.includes('tamborradata.com');
  const isVercel = host?.includes('vercel.app');

  // Orígenes permitidos
  const allowedOrigins = [
    'https://tamborradata.com',
    'https://www.tamborradata.com',
    'http://localhost:3000',
    'https://localhost:3000',
  ];

  // Verificar si es una petición válida
  const isValidOrigin = origin && allowedOrigins.includes(origin);
  const isValidReferer = referer && allowedOrigins.some((allowed) => referer.startsWith(allowed));
  const isDirectAccess = !origin && !referer; // Acceso directo desde el navegador

  // Permitir si:
  // 1. Es localhost (desarrollo)
  // 2. Es el dominio de producción
  // 3. Tiene origen válido
  // 4. Tiene referer válido
  // 5. Es acceso directo desde navegador
  if (
    isLocalhost ||
    isProduction ||
    isVercel ||
    isValidOrigin ||
    isValidReferer ||
    isDirectAccess
  ) {
    console.log('[Middleware] ✅ Acceso permitido');
    return NextResponse.next();
  }

  console.warn('[Middleware] ❌ Acceso bloqueado desde:', origin || referer || host);
  return new NextResponse('Not found', { status: 404 });
}

export const config = {
  matcher: ['/api/:path*'],
};
