'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import { providerMap } from '@/auth';
import authenticate from './action';

export default function SignIn() {
  return (
    <SignInPage
      sx={{ bgColor: '#fff' }}
      providers={providerMap}
      localeText={{
        signInTitle: 'Bem vindo',
        signInSubtitle: 'Informe seu Login e Senha para continuar',
        providerSignInTitle: (provider: string) => 'Entrar',
      }}
      slotProps={{
        submitButton: {
          variant: 'contained',
          color: 'primary',
          title: 'Entrar',
          size: 'large',
          disableElevation: true,
          fullWidth: true,
          sx: { mt: 2 }
        },
        emailField: {
          type: 'text',
          label: 'Usuário',
          placeholder: 'Usuário',
          sx: { mb: 2 }
        },
        passwordField: {
          label: 'Senha',
          placeholder: '********'
        },
        rememberMe: {
          sx: { display: 'none' }
        }
      }}
      signIn={authenticate as any}
    />
  );
}