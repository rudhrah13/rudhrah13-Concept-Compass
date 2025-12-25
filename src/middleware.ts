import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/actions';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent middleware from running on static assets and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image') || pathname.endsWith('.ico')) {
    return NextResponse.next();
  }

  const user = await getAuthenticatedUser();
  const isLoginPage = pathname === '/';

  if (!user && !isLoginPage) {
    // If not logged in and not on the login page, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (user) {
    const userDashboard = `/${user.role}/dashboard`;
    // If logged in and on the login page, redirect to their dashboard
    if (isLoginPage) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }
    // If logged in but on the wrong path, redirect to their dashboard
    if (!pathname.startsWith(`/${user.role}`)) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
