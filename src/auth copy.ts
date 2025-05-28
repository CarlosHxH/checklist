import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { compare } from 'bcryptjs';
import prisma from '@/prisma';
import { encoded } from './webToken';

interface CustomUser {
  id: string;
  role: string;
  username: string;
  email: string;
  name: string;
  image: string | null;
}


const providers: Provider[] = [
  Credentials({
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(c) {
      if (!c?.username || !c?.password) throw new AuthError("Campos não preenchidos!");
      const { username, password } = c as { username: string, password: string };
      // Buscar usuário
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user || !user.password || !user?.isActive)
        throw new AuthError("Credenciais inválidas!");
      // Verificar senha
      if (!(await compare(password, user.password)))
        throw new AuthError("Credenciais inválidas!");
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
  }),
];


if (!process.env.AUTH_SECRET) {
  console.warn('Missing environment variable "AUTH_SECRET"');
}
if (!process.env.DATABASE_URL) {
  console.warn('Missing environment variable "DATABASE_URL"');
}

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/');

      if (isPublicPage || isLoggedIn) {
        return true;
      }

      return false; // Redirect unauthenticated users to login page
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as CustomUser).username;
        token.role = (user as CustomUser).role ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      const token = await encoded({
        user: {
          id:user.id,
          username: (user as CustomUser).username,
          role: (user as CustomUser).role,
        }
      });

      await prisma.account.create({
        data: {
          provider: 'credentials',
          type: 'credentials',
          providerAccountId: user.id,
          access_token: token,
          expires_at: Date.now()+1000*60*60*12,
          token_type:'authorization',
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });
      console.log(`Logado: ${(user as CustomUser).username}`);
    },
    async signOut({ token }: any) {
      // Remover tokens ao fazer logout
      await prisma.account.deleteMany({
        where: {
          userId: token.id as string,
          provider: "credentials",
        }
      });
      console.log(`Deslogado: ${token.username}`);
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 days
    updateAge: 24 * 60 * 60 // Update session data every 24 hours
  },
  logger: {
    error(code, ...message){},
    warn(code, ...message){},
    debug(code, ...message){},
  },
});



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
*/