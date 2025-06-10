// auth.ts - Versão corrigida
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { compare } from 'bcryptjs';
import prisma from '@/prisma';

interface CustomUser {
  id: string;
  role: string;
  username: string;
  email: string;
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
    return null; // Retorna null em vez de lançar exceção
  }
}

// Função auxiliar para validar credenciais - CORRIGIDA
async function validateCredentials(username: string, password: string) {
  const user = await findUserByUsername(username);

  // Retorna null para falhas de validação em vez de lançar exceções
  if (!user) {
    console.log(`Tentativa de login com usuário inexistente: ${username}`);
    return null;
  }

  if (!user.password) {
    console.log(`Usuário ${username} sem senha configurada`);
    return null;
  }

  if (!user.isActive) {
    console.log(`Conta desativada para usuário: ${username}`);
    return null;
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Credenciais inválidas para usuário: ${username}`);
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email || '',
    name: user.name,
    role: user.role,
    image: user.image,
  };
}

let r = '';

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
          console.log('Credenciais não fornecidas');
          return null;
        }

        const { username, password } = credentials as { username: string; password: string };

        // Validate credentials and get user
        const user = await validateCredentials(username, password);

        if (!user) {
          // Log sem detalhes sensíveis
          console.log('Falha na autenticação');
          return null;
        }

        console.log(`Login bem-sucedido para usuário: ${user.username}`);
        r = user.role
        // Return user in NextAuth User format
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
          role: user.role,
        };
      } catch (error) {
        console.error('Erro inesperado na autorização:', error);
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

      return false;
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
    },
    async redirect({ url, baseUrl }) {
      let path = '/';

      if (r && r === "ADMIN") path = '/dashboard';

      return url.startsWith(baseUrl) ? url : baseUrl + path;
    }
  },
  events: {
    async signIn({ user }) {
      try {
        console.log(`Usuário logado com sucesso: ${(user as CustomUser).username}`);
      } catch (error) {
        console.error('Erro ao criar account no signIn:', error);
      }
    },
    async signOut({ token }: any) {
      try {
        await prisma.account.deleteMany({
          where: {
            userId: token.id as string,
            provider: "credentials",
          }
        });

        console.log(`Usuário deslogado: ${token.username}`);
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
      // Filtrar logs desnecessários de CredentialsSignin
      //if (code !== 'CREDENTIALS_SIGNIN_ERROR') {
      //}
      //console.error(`NextAuth Error [${code}]:`, ...message);
    },
    warn(code, ...message) {
      //console.warn(`NextAuth Warning [${code}]:`, ...message);
    },
    debug(code, ...message) {
      // Comentar em produção
      // console.debug(`NextAuth Debug [${code}]:`, ...message);
    },
  },
});