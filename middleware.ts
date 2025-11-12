import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/api')) return NextResponse.next();

  const host = req.headers.get('host');
  if (
    host?.includes('tamborradata.com') ||
    host?.includes('vercel.app') ||
    host?.includes('localhost')
  ) {
    return NextResponse.next();
  }

  return new NextResponse('Forbidden!', { status: 403 });
}

export const config = {
  matcher: ['/api/:path*'],
};
