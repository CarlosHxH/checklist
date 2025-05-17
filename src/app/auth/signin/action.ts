"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { AuthProvider } from "@toolpad/core/SignInPage";

export const login: (
  provider: AuthProvider,
  formData: FormData,
) => void = async (provider, formData) => {
  const promise = new Promise<void>(async(resolve,reject) => {
    try {
      const res = await signIn(provider.id, {
        ...(formData && { username: formData.get('email'), password: formData.get('password') }),
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
      ...(formData && { username: formData.get('email'), password: formData.get('password') }),
      redirectTo: callbackUrl ?? '/',
    });
  } catch (error) {
    // Handle NEXT_REDIRECT error separately to allow redirects to work
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    // Handle Auth.js errors
    if (error instanceof AuthError) {
      const errorMessage = error.message.split(". Read more")[0].trim();
      return {
        error: error.cause || errorMessage,
        type: (error as any).type,
      };
    }

    // Handle any other errors
    return {
      error: "Algo deu errado.",
      type: "UnknownError",
    };
  }
}


export const testAuth = async (
  provider: AuthProvider,
  formData: FormData,
  callbackUrl?: string,
) => {
  'use server';
  try {
    return await signIn(provider.id, {
      ...(formData && {
        email: formData.get('email'),
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
        error:
          (error as any).type === 'CredentialsSignin'
            ? 'Invalid credentials.'
            : 'An error with Auth.js occurred.',
        type: (error as any).type,
      };
    }
    return {
      error: 'Something went wrong.',
      type: 'UnknownError',
    };
  }
}