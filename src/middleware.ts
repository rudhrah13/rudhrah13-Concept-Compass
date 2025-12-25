import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthenticatedUser, login } from '@/lib/auth/actions';
import { users } from '@/lib/mock-data';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent middleware from running on static assets and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image') || pathname.endsWith('.ico')) {
    return NextResponse.next();
  }

  let user = await getAuthenticatedUser();
  const isLoginPage = pathname === '/';

  // If user is not logged in, log them in as default student
  if (!user) {
    const studentUser = users.find(u => u.role === 'student');
    if (studentUser) {
        const formData = new FormData();
        formData.append('role', studentUser.role);
        formData.append('id', studentUser.id);
        
        // The login action sets the cookie. We need a response object to attach the cookie to.
        const response = NextResponse.redirect(new URL(`/${studentUser.role}/dashboard`, request.url));
        
        // Create a new Headers object from the response
        const newHeaders = new Headers(response.headers);

        // Call the login function which returns the cookie string
        const cookie = await login(formData);
        
        // Set the cookie on the new headers
        if (cookie) {
            newHeaders.set('Set-Cookie', cookie);
        }

        // Return a new response with the modified headers
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }
  }

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
    // This part should theoretically not be reached with the new logic, but kept as a fallback.
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
