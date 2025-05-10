import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/login", "/register", "/otp"];
const protectedRoutes = ["/admin", "/profile"];

export default auth(async (req: NextRequest) => {
  const { pathname, searchParams } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Handle public routes for logged-in users
  if (isPublicRoute && isLoggedIn && pathname !== "/admin") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  // Handle protected routes for unauthenticated users
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Restrict access to admin routes for non-admin users
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Handle OTP route with missing query parameters
  if (pathname.startsWith("/otp")) {
    const iv = searchParams.get("iv");
    const encrypted = searchParams.get("encrypted");

    if (!iv || !encrypted) {
      console.log("Missing Query Params. Redirecting to Signup...");
      return NextResponse.redirect(new URL("/signup", req.nextUrl));
    }
  }

  return NextResponse.next();
});

// Middleware configuration
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\..*|sitemap.xml|robots.txt).*)",
  ],
};
