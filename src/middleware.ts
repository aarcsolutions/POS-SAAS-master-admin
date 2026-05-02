import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Enterprise Route Guard (Middleware)
 * Automatically handles redirects based on session status.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies (Next.js internal cookie parser)
  const accessToken = request.cookies.get('access_token')?.value;

  // 1. Root redirect logic
  if (pathname === '/') {
    return NextResponse.redirect(new URL(accessToken ? '/dashboard' : '/login', request.url));
  }

  // 2. Auth Guard: Prevent access to protected routes if not logged in
  // We check for any path that isn't login or public assets
  const isPublicPath = pathname === '/login' || pathname.startsWith('/_next') || pathname.includes('favicon.ico');
  
  if (!isPublicPath && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Login Guard: Prevent logged-in users from visiting login page
  if (pathname === '/login' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure middleware runs on all paths except static files and APIs
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
