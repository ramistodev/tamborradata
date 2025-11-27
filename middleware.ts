import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
