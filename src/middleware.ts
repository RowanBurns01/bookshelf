import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/discover/:path*",
    "/my-books/:path*",
    "/lists/:path*",
    "/profile/:path*",
  ],
} 