import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/discover/:path*",
    "/my-books/:path*",
    "/lists/:path*",
    "/profile/:path*",
  ],
} 