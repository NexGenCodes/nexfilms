import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET })
    const isAuth = !!token
    const isAdmin = token?.role === "ADMIN"
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

    // Redirect unauthenticated users from admin pages to login
    if (isAdminPage && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirect non-admin users from admin pages
    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Redirect authenticated users from auth pages to home
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/profile/:path*"],
}
