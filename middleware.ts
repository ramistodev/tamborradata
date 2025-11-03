import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo aplicamos el middleware a rutas /api
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const origin = req.headers.get('origin');
  const host = req.headers.get('host'); // fallback por si origin no viene

  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://tamborradata.com';

  console.log('[Middleware] Origin:', origin, '| Host:', host);

  // Permitir si la petición viene del mismo dominio o localhost
  const isFrontendRequest =
    (origin && (origin === allowedOrigin || origin === 'https://www.tamborradata.com')) ||
    host?.includes('localhost:3000');

  if (!isFrontendRequest) {
    console.warn('[Middleware] ❌ Acceso bloqueado desde:', origin || host);
    return new NextResponse('Not found', { status: 404 });
  }

  console.log('[Middleware] ✅ Acceso permitido desde:', origin || host);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
