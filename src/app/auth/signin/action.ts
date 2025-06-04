// action.ts - Versão corrigida
"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { AuthProvider } from "@toolpad/core/SignInPage";

export const login: (
  provider: AuthProvider,
  formData: FormData,
) => void = async (provider, formData) => {
  const promise = new Promise<void>(async(resolve, reject) => {
    try {
      const res = await signIn(provider.id, {
        ...(formData && { 
          username: formData.get('email'), 
          password: formData.get('password') 
        }),
        redirect: false
      });
      console.log(res);
      resolve(res);
    } catch (error) {
      reject(error)
    }
  });
  return promise;
};

export default async function authenticate(
  provider: AuthProvider,
  formData: FormData,
  callbackUrl?: string
) {
  try {
    return await signIn(provider.id, {
      ...(formData && { 
        username: formData.get('email'), 
        password: formData.get('password') 
      }),
      redirectTo: callbackUrl ?? '/',
    });
  } catch (error) {
    // Handle NEXT_REDIRECT error separately to allow redirects to work
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    
    // Handle Auth.js errors
    if (error instanceof AuthError) {
      // Mapear diferentes tipos de erro para mensagens mais amigáveis
      let errorMessage = "Erro na autenticação";
      
      switch ((error as any).type) {
        case 'CredentialsSignin':
          errorMessage = "Usuário ou senha inválidos";
          break;
        case 'CallbackRouteError':
          errorMessage = "Erro no processo de login";
          break;
        case 'AccessDenied':
          errorMessage = "Acesso negado";
          break;
        default:
          errorMessage = "Erro na autenticação";
      }
      
      return {
        error: errorMessage,
        type: (error as any).type,
      };
    }

    // Handle any other errors
    console.error('Erro não tratado na autenticação:', error);
    return {
      error: "Algo deu errado. Tente novamente.",
      type: "UnknownError",
    };
  }
}

// Função de teste mais limpa
export const testAuth = async (
  provider: AuthProvider,
  formData: FormData,
  callbackUrl?: string,
) => {
  'use server';
  try {
    return await signIn(provider.id, {
      ...(formData && {
        username: formData.get('email'), // Corrigido: usar 'username' consistentemente
        password: formData.get('password'),
      }),
      redirectTo: callbackUrl ?? '/',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    if (error instanceof AuthError) {
      return {
        error: (error as any).type === 'CredentialsSignin'
          ? 'Usuário ou senha inválidos'
          : 'Erro no processo de autenticação',
        type: (error as any).type,
      };
    }
    
    return {
      error: 'Algo deu errado. Tente novamente.',
      type: 'UnknownError',
    };
  }
}