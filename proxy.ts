import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './app/(frontend)/i18n/routing';

const handleI18n = createMiddleware(routing);

function guardApi(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) return guardApi(req);
  return handleI18n(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/api/:path*'],
};
