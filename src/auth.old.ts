import NextAuth, { AuthError, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/prisma';
import { encoded } from './webToken';
import { JWT } from 'next-auth/jwt';

// Extender tipos do NextAuth
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: string;
      email: string;
      name: string;
      image?: string | null;
    }
  }

  interface User {
    id: string;
    username: string;
    role: string;
    email: string;
    name: string;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
}

// Schema de validação para credenciais
const credentialsSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Password é obrigatório'),
});

// Constantes de configuração
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 horas
const TOKEN_EXPIRY = 12 * 60 * 60 * 1000; // 12 horas em ms

// Validação de variáveis de ambiente
const requiredEnvVars = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

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
    throw new AuthError('Credenciais inválidas!');
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
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
  };
}

// Função auxiliar para criar token de acesso
async function createAccessToken(userId: string, username: string, role: string) {
  try {
    const token = await encoded({
      user: { id: userId, username, role }
    });

    await prisma.account.create({
      data: {
        provider: 'credentials',
        type: 'credentials',
        providerAccountId: userId,
        access_token: token,
        expires_at: Date.now() + TOKEN_EXPIRY,
        token_type: 'authorization',
        user: { connect: { id: userId } }
      }
    });

    return token;
  } catch (error) {
    console.error('Erro ao criar token de acesso:', error);
    // Não bloquear o login se falhar - pode ser usado para auditoria
  }
}

// Função auxiliar para limpar tokens expirados
async function cleanupExpiredTokens(userId: string) {
  try {
    await prisma.account.deleteMany({
      where: {
        userId,
        provider: 'credentials',
        expires_at: { lt: Date.now() }
      }
    });
  } catch (error) {
    console.error('Erro ao limpar tokens expirados:', error);
  }
}

// Configuração dos provedores
const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      username: { 
        label: 'Username', 
        type: 'text',
        placeholder: 'Digite seu username'
      },
      password: { 
        label: 'Password', 
        type: 'password',
        placeholder: 'Digite sua senha'
      }
    },
    async authorize(credentials) {
      try {
        // Validar entrada
        const validatedCredentials = credentialsSchema.parse(credentials);
        // Validar credenciais e retornar usuário
        const user = await validateCredentials(
          validatedCredentials.username,
          validatedCredentials.password
        );

        return user;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new AuthError('Dados inválidos fornecidos');
        }
        throw error;
      }
    },
  }),
];

// Mapeamento de provedores para UI
export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    }
    return { id: provider.id, name: provider.name };
  })
  .filter(Boolean);

// Configuração principal do NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isAuthPage = nextUrl.pathname.startsWith('/auth');
      const isPublicPage = nextUrl.pathname === '/' || 
                          nextUrl.pathname.startsWith('/public');

      // Redirecionar usuários logados para longe das páginas de auth
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Permitir acesso a páginas públicas e usuários autenticados
      if (isPublicPage || isLoggedIn) {
        return true;
      }

      return false;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }

      // Renovar token se necessário
      if (trigger === 'update') {
        // Aqui você pode buscar dados atualizados do usuário se necessário
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    }
  },

  events: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials' && user) {
        try {
          // Limpar tokens expirados antes de criar novo
          await cleanupExpiredTokens(user.id);
          
          // Criar novo token de acesso
          await createAccessToken(user.id, user.username, user.role);
          
          console.log(`✅ Login realizado: ${user.username} (${user.role})`);
        } catch (error) {
          console.error('❌ Erro no evento de signIn:', error);
        }
      }
    },

    async signOut({ token }:any) {
      if (token?.id) {
        try {
          // Remover todos os tokens do usuário
          const deletedCount = await prisma.account.deleteMany({
            where: {
              userId: token.id,
              provider: 'credentials',
            }
          });

          console.log(`✅ Logout realizado: ${token.username} (${deletedCount.count} tokens removidos)`);
        } catch (error) {
          console.error('❌ Erro no evento de signOut:', error);
        }
      }
    },

    async session({ session }) {
      // Log de atividade de sessão se necessário
      console.log(`🔄 Sessão ativa: ${session.user?.username}`);
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_MAX_AGE / 2, // Atualizar na metade do tempo de vida
  },

  // Logger mais robusto
  logger: {
    error: () => {},
    warn: () => {},
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`🔍 NextAuth Debug [${code}]:`, metadata);
      }
    },
  },

  // Configurações de segurança adicionais
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
});