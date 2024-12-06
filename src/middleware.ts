import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // console.log('middleware', request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|images|favicon.ico|sitemap|robots.txt).*)',
};
