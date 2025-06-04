// auth
import NextAuth, { AuthError, CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { compare } from 'bcryptjs';
import prisma from '@/prisma';
import { encoded } from './webToken';

interface CustomUser {
  id: string;
  role: string;
  username: string;
  email: string; // Changed from string | null to string
  name: string;
  image: string | null;
}

// Função auxiliar para buscar usuário
async function findUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        image: true,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new AuthError('Erro interno do servidor');
  }
}

// Função auxiliar para validar credenciais
async function validateCredentials(username: string, password: string) {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new CredentialsSignin('Credenciais inválidas!');
  }

  if (!user.password) {
    throw new AuthError('Usuário sem senha configurada');
  }

  if (!user.isActive) {
    throw new AuthError('Conta desativada');
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthError('Credenciais inválidas!');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email || '', // Ensure email is never null
    name: user.name,
    role: user.role,
    image: user.image,
  };
}

class CustomError extends CredentialsSignin {
  code = "custom_error";
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      try {
        // Validate that credentials exist
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { username, password } = credentials as { username: string; password: string };
        
        // Validate credentials and get user
        const user = await validateCredentials(username, password);
        
        // Return user in NextAuth User format
        return {
          id: user.id,
          name: user.name,
          email: user.email || '', // Ensure email is never null
          image: user.image,
          username: user.username,
          role: user.role,
        };
      } catch (error) {
        console.error('Erro na autorização:', error);
        // Return null instead of throwing to indicate authentication failure
        return null;
      }
    },
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
      const isPublicPage = nextUrl.pathname.startsWith('/auth') || nextUrl.pathname === '/';

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
      try {
        const token = await encoded({
          user: {
            id: user.id,
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
            expires_at: Date.now() + 1000 * 60 * 60 * 12,
            token_type: 'authorization',
            user: {
              connect: {
                id: user.id
              }
            }
          }
        });
        
        console.log(`Logado: ${(user as CustomUser).username}`);
      } catch (error) {
        console.error('Erro ao criar account no signIn:', error);
      }
    },
    async signOut({ token }: any) {
      try {
        // Remover tokens ao fazer logout
        await prisma.account.deleteMany({
          where: {
            userId: token.id as string,
            provider: "credentials",
          }
        });
        
        console.log(`Deslogado: ${token.username}`);
      } catch (error) {
        console.error('Erro ao remover tokens no signOut:', error);
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
    updateAge: 24 * 60 * 60 // Update session data every 24 hours
  },
  logger: {
    error(code, ...message) { 
      console.error(`NextAuth Error [${code}]:`, ...message);
    },
    warn(code, ...message) { 
      console.warn(`NextAuth Warning [${code}]:`, ...message);
    },
    debug(code, ...message) { 
      console.debug(`NextAuth Debug [${code}]:`, ...message);
    },
  },
});