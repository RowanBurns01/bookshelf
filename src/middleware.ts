import { auth } from "./app/api/auth/[...nextauth]/route"

export default auth

export const config = {
  matcher: [
    "/discover/:path*",
    "/my-books/:path*",
    "/lists/:path*",
    "/profile/:path*",
  ],
} 