import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Solo aplicamos el middleware a rutas /api
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const origin = req.headers.get('origin') || '';
  const secret = req.headers.get('x-app-secret');

  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://tamborradata.com';
  const allowedSecret = process.env.APP_SECRET_KEY;

  console.log('[Middleware] Origin recibido:', origin);

  // --- Permitir peticiones del frontend oficial ---
  const isFromAllowedOrigin =
    origin === allowedOrigin ||
    origin === 'https://www.tamborradata.com' || // por si usas www
    origin === 'http://localhost:3000'; // para desarrollo local

  // --- Permitir peticiones internas autenticadas (por backend scripts) ---
  const isFromAuthorizedBackend = secret && secret === allowedSecret;

  // --- Si ninguna de las dos condiciones se cumple, bloquear ---
  if (!isFromAllowedOrigin && !isFromAuthorizedBackend) {
    console.warn('[Middleware] Acceso denegado desde:', origin);
    return new NextResponse('Not found', { status: 404 });
  }

  // Todo correcto -> continuar
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
