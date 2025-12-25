import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is empty as the auth flow is handled by client-side routing.
// It can be used later for protecting routes once real authentication is implemented.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
