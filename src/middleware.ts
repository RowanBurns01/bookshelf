import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Authentication middleware that checks for a valid session token
 * and redirects to the login page if not authenticated
 */
export default async function middleware(request: NextRequest) {
  // Check for session token in cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value

  // Redirect to login if no session token found
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Protected routes that require authentication
export const config = {
  matcher: [
    '/discover/:path*',
    '/my-books/:path*',
    '/profile/:path*',
  ],
}
