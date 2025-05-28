(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__dc15d093._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// middleware.ts
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const __TURBOPACK__default__export__ = auth(async (req)=>{
    // The auth function adds the auth object to the request
    const { auth: session } = req;
    const { nextUrl } = req;
    // Redirect non-admin users away from dashboard
    if (session?.user?.role !== "ADMIN" && nextUrl.pathname.startsWith("/dashboard")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", nextUrl.origin));
    }
    // Handle API route permissions
    if (nextUrl.pathname.startsWith("/api/v1/")) {
        // Check if user has required role for dashboard API
        if (!session?.user || ![
            "ADMIN",
            "USER",
            "DRIVER"
        ].includes(session?.user?.role || "DRIVER")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Unauthorized access"
            }, {
                status: 403
            });
        }
    }
    // Handle API route permissions
    if (nextUrl.pathname.startsWith("/api/v2/")) {
        // Check if user has required role for dashboard API
        if (!session?.user || ![
            "ADMIN",
            "USER"
        ].includes(session?.user?.role || "DRIVER")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Unauthorized access"
            }, {
                status: 403
            });
        }
    }
    // Let auth API routes pass through
    if (nextUrl.pathname.startsWith("/api/auth")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // If user is NOT logged in and tries to access protected routes
    if (!session?.user && !nextUrl.pathname.startsWith("/auth/")) {
        // Store the original URL they were trying to visit
        const redirectUrl = new URL("/auth/signin", nextUrl.origin);
        redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
    }
    // Permit all other scenarios
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
});
const config = {
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
        "/api/v2/:path*"
    ]
}; /*
  // If user IS logged in and tries to access auth pages (prevent logged-in users from seeing login page)
  if (session?.user && nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }
*/  /*
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
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__dc15d093._.js.map