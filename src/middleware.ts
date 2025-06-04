import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { decoded, encoded } from "./webToken";

export default auth(async (req) => {
  const { auth: session } = req;
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Skip middleware for public API routes
  if (pathname.startsWith("/api/public/")) {
    return NextResponse.next();
  }

  // Handle JWT token for authenticated users
  if (session?.user) {
    const token = await encoded({
      user: {
        id: session.user.id,
        username: session.user.username,
        role: session.user.role,
      }
    });
    
    if (token) {
      req.headers.set('Authorization', `Bearer ${token}`);
      req.headers.set('X-Content-Type-Options', 'nosniff');
      req.headers.set('X-Frame-Options', 'DENY');
      req.headers.set('X-XSS-Protection', '1; mode=block');
    }
  }

  // API Token Verification
  if (!session?.user && pathname.startsWith("/api/v")) {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1]?.trim();

    if (!token) {
      return NextResponse.json({ error: "Authentication required" },{ status: 401 });
    }

    try {
      const verify = await decoded(token);
      if (!verify?.exp || verify.exp <= Date.now()/1000) {
        return NextResponse.json({ error: "Token expired" },{ status: 401 });
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" },{ status: 401 });
    }
  }

  // Admin dashboard protection
  if (pathname.startsWith("/dashboard") && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // API v1 role validation
  if (pathname.startsWith("/api/v1/")) {
    if (!session?.user?.role || !["ADMIN", "USER", "DRIVER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" },{ status: 403 });
    }
  }

  // API v2 role validation (more restrictive)
  if (pathname.startsWith("/api/v2/")) {
    if (!session?.user?.role || !["ADMIN", "USER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" },{ status: 403 });
    }
  }

  // Auth routes handling
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in
  if (!session?.user && !pathname.startsWith("/auth/")) {
    const redirectUrl = new URL("/auth/signin", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/auth/:path*",
    "/",
    "/dashboard/:path*",
    "/inspection/:path*",
    "/viagem/:path*",
    "/api/v1/:path*",
    "/api/v2/:path*",
  ],
};