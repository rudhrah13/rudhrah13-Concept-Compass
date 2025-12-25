import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware handles basic, client-side role-based route protection.
// It is NOT a substitute for real authentication.
export function middleware(request: NextRequest) {
  const roleCookie = request.cookies.get('app-role');
  const role = roleCookie?.value;

  const { pathname } = request.nextUrl;

  // Student trying to access teacher routes
  if (pathname.startsWith('/teacher') && role === 'student') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  // Teacher trying to access student routes
  if (pathname.startsWith('/student') && role === 'teacher') {
    return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
  }
  
  // User with no role trying to access protected routes
  if ((pathname.startsWith('/student') || pathname.startsWith('/teacher')) && !role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*'],
}
