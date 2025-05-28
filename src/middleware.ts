// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";


// Using Next-Auth v5's middleware pattern
export default auth(async (req) => {
  // The auth function adds the auth object to the request
  const { auth: session } = req;
  const { nextUrl } = req;
  
  // Redirect non-admin users away from dashboard
  if (session?.user?.role !== "ADMIN" && nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Handle API route permissions
  if (nextUrl.pathname.startsWith("/api/v1/")) {
    // Check if user has required role for dashboard API
    if (!session?.user || !["ADMIN", "USER","DRIVER"].includes(session?.user?.role||"DRIVER")) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }
  }

    // Handle API route permissions
    if (nextUrl.pathname.startsWith("/api/v2/")) {
      // Check if user has required role for dashboard API
      if (!session?.user || !["ADMIN", "USER"].includes(session?.user?.role||"DRIVER")) {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 403 }
        );
      }
    }

  // Let auth API routes pass through
  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // If user is NOT logged in and tries to access protected routes
  if (!session?.user && !nextUrl.pathname.startsWith("/auth/")) {
    // Store the original URL they were trying to visit
    const redirectUrl = new URL("/auth/signin", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Permit all other scenarios
  return NextResponse.next();
}) as unknown as (request: NextRequest) => Promise<NextResponse>;

// Configure which routes the middleware applies to
export const config = {
  // Add all routes that should be protected or have redirect logic
  matcher: [
    // Auth routes
    "/auth/:path*",
    // Protected routes
    "/",
    "/dashboard/:path*",
    "/inspection/:path*",
    "/viagem/:path*",
    "/api/v1/:path*",
    "/api/v2/:path*",
    // Add other routes as needed
  ],
};



/*
  // If user IS logged in and tries to access auth pages (prevent logged-in users from seeing login page)
  if (session?.user && nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }
*/
/*
  // Verificar se a rota começa com /api/v1
  const authHeader = req.headers.get("authorization");
  if (authHeader && req.nextUrl.pathname.startsWith("/api/v1")) {
    try {
      // Obter o token do header de autorização
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new NextResponse(
          JSON.stringify({ error: "Token não fornecido" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      const token = authHeader.split(' ')[1];

      
      if (!account) {
        return new NextResponse(
          JSON.stringify({ error: "Conta não encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      return NextResponse.next();
    } catch (error) {
      // Token inválido ou expirado
      return new NextResponse(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }
*/