import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/auth/login", "/auth/register", "/auth/otp"];
const protectedRoutes = ["/admin", "/profile"];

export default auth(async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user.role === "ADMIN";
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const redirects = {
    public: "/admin",
    protected: "/auth/login",
    signup: "/auth/register",
  };

  // Redirect unauthenticated users from admin pages to login
  if (isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(redirects.public, req.nextUrl));
  }

  // Redirect non-admin users from admin pages
  if (isProtectedRoute && !isAdmin) {
    return NextResponse.redirect(new URL(redirects.protected, req.nextUrl));
  }

  // Redirect authenticated users from auth pages to home
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\..*|sitemap.xml|robots.txt).*)",
  ],
};
