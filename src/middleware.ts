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

  if (user) {
    // If user is logged in, redirect from login page to their dashboard
    if (isLoginPage) {
      return NextResponse.redirect(new URL(`/${user.role}/dashboard`, request.url));
    }
    // If user is logged in but trying to access a page for another role, redirect to their own dashboard
    if (!pathname.startsWith(`/${user.role}`)) {
      return NextResponse.redirect(new URL(`/${user.role}/dashboard`, request.url));
    }
  } else {
    // If user is not logged in and not on the login page, redirect to login
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
