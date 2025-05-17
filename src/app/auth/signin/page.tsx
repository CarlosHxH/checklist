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
      }}
      slotProps={{
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
        },
        submitButton: {
          title: "Entrar"
        }
      }}
      signIn={authenticate as any}
    />
  );
}
