(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__b6b34e8d._.js", {

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
"[project]/src/prisma.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "prisma": (()=>prisma)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$2f$default$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/client/default.js [middleware-edge] (ecmascript)");
;
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$2f$default$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["PrismaClient"]();
const __TURBOPACK__default__export__ = prisma;
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}}),
"[project]/src/auth.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "auth": (()=>auth),
    "handlers": (()=>handlers),
    "providerMap": (()=>providerMap),
    "signIn": (()=>signIn),
    "signOut": (()=>signOut)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/errors.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/credentials.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$dist$2f$bcrypt$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/dist/bcrypt.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/prisma.ts [middleware-edge] (ecmascript)");
;
;
;
;
/*
// Generate a secure key (in production, use environment variables)
export const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET
);
// JOSE encryption configuration
const ENCRYPTION_ALG = 'A256GCM'; // AES-GCM with 256-bit key
const KEY_ALG = 'dir';           // Direct encryption with shared key
/**
 * Custom JWT Encoding function using JOSE
 * @param token - The token to encrypt
 * /
export async function encodeJWT({ token }: { token: jose.JWTPayload }): Promise<string> {
  try {
    // Convert token to a string for encryption
    const tokenString = JSON.stringify(token);

    // Create a JWE (JSON Web Encryption)
    const jwe = await new jose.CompactEncrypt(
      new TextEncoder().encode(tokenString)
    )
      .setProtectedHeader({
        alg: KEY_ALG,
        enc: ENCRYPTION_ALG
      })
      .encrypt(SECRET_KEY);

    return jwe;
  } catch (error) {
    console.error("Error encoding JWT:", error);
    throw new Error("Failed to encode JWT");
  }
}

/**
 * Custom JWT Decoding function using JOSE
 * @param token - The encrypted token to decrypt
 * /
export async function decodeJWT(token: string): Promise<jose.JWTPayload> {
  try {
    // Decrypt the JWE
    const { plaintext } = await jose.compactDecrypt(token, SECRET_KEY);

    // Convert decrypted data back to an object
    const decodedToken = JSON.parse(new TextDecoder().decode(plaintext));
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new Error("Failed to decode JWT");
  }
}
// Example of using custom payloads in the token
export interface CustomJWT extends jose.JWTPayload {
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  customClaims?: {
    permissions?: string[];
    metadata?: Record<string, any>;
  };
}
*/ const providers = [
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])({
        credentials: {
            username: {
                label: "Username",
                type: "text"
            },
            password: {
                label: "Password",
                type: "password"
            }
        },
        async authorize (c) {
            if (!c?.username || !c?.password) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["AuthError"]("Campos não preenchidos!");
            const { username, password } = c;
            // Buscar usuário
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].user.findUnique({
                where: {
                    username
                }
            });
            if (!user || !user.password || !user?.isActive) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["AuthError"]("Credenciais inválidas!");
            // Verificar senha
            if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$dist$2f$bcrypt$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["compare"])(password, user.password)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$errors$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["AuthError"]("Credenciais inválidas!");
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            };
        }
    })
];
if (!process.env.AUTH_SECRET) {
    console.warn('Missing environment variable "AUTH_SECRET"');
}
if (!process.env.DATABASE_URL) {
    console.warn('Missing environment variable "DATABASE_URL"');
}
const providerMap = providers.map((provider)=>{
    if (typeof provider === 'function') {
        const providerData = provider();
        return {
            id: providerData.id,
            name: providerData.name
        };
    }
    return {
        id: provider.id,
        name: provider.name
    };
});
const { handlers, auth, signIn, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    providers,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        authorized ({ auth: session, request: { nextUrl } }) {
            const isLoggedIn = !!session?.user;
            const isPublicPage = nextUrl.pathname.startsWith('/');
            if (isPublicPage || isLoggedIn) {
                return true;
            }
            return false; // Redirect unauthenticated users to login page
        },
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role ?? "";
            }
            return token;
        },
        async session ({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.role = token.role;
            }
            return session;
        }
    },
    events: {
        async signIn ({ user }) {
            console.log(`Usuário logado: ${user.username}`);
        },
        async signOut ({ token }) {
            // Remover tokens ao fazer logout
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$prisma$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].account.deleteMany({
                where: {
                    userId: token.id,
                    provider: "credentials"
                }
            });
            console.log(`Usuário deslogado: ${token.username}`);
        }
    },
    session: {
        strategy: "jwt"
    },
    logger: {
        error (code, ...message) {},
        warn (code, ...message) {},
        debug (code, ...message) {}
    }
});
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.ts [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["auth"])(async (req)=>{
    // The auth function adds the auth object to the request
    const { auth: session } = req;
    const { nextUrl } = req;
    // Redirect non-admin users away from dashboard
    if (session?.user?.role !== "ADMIN" && nextUrl.pathname.startsWith("/dashboard")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", nextUrl.origin));
    }
    // Handle API route permissions
    if (nextUrl.pathname.startsWith("/api/v2/dashboard")) {
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
        "/api/v1/:path*"
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b6b34e8d._.js.map