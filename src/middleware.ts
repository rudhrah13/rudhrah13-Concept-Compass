import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is a placeholder and does not perform any role-based checks,
// as localStorage is not accessible on the server.
// The actual route protection is handled client-side by the `useProtectedRoute` hook.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*'],
}
