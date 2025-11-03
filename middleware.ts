import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const origin = req.headers.get('origin') || '';
  const secret = req.headers.get('x-app-secret');

  const allowedOrigin = process.env.ALLOWED_ORIGIN!;
  const allowedSecret = process.env.APP_SECRET_KEY!;

  console.log('Middleware - Origin: ' + origin);

  if (!origin || origin === allowedOrigin || origin === 'http://localhost:3000')
    return NextResponse.next();

  if (secret && secret === allowedSecret) return NextResponse.next();

  return new NextResponse('Not found', { status: 404 });
}

export const config = {
  matcher: ['/api/:path*'],
};
