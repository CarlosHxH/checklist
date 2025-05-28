import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import ThemeWrapper from './ThemeWrapper';
import Image from 'next/image';
import './page.module.css'
import type { Metadata } from 'next';
import { LICENSE_STATUS, LicenseInfo } from '@mui/x-license';
import { base64Encode } from '@/utils/base64';

// Função para gerar uma licença de teste
export function generateTestLicense(orderNumber:string, expiryDays = 30, planScope = 'pro', licenseModel = 'perpetual') {
  const expiryTimestamp = Date.now() + expiryDays * 24 * 60 * 60 * 1000; // Expira em 'expiryDays' dias
  const licenseKey = `ORDER:${orderNumber},EXPIRY=${Math.floor(expiryTimestamp / 1000)},KEYVERSION=Q3-2024`;
  
  // Codifica a licença em base64
  const encodedLicense = base64Encode(licenseKey);
  
  return encodedLicense;
}

// Exemplo de uso
const testLicense = generateTestLicense('123456', 9999, 'premium', 'perpetual');
console.log('Licença de teste gerada:', testLicense, LICENSE_STATUS.Valid);

LicenseInfo.setLicenseKey(
  'T1JERVI6MTIzNDU2LEVYUElSWT0yNjEyMzY1NTgyLEtFWVZFUlNJT049UTMtMjAyNA=='
  //'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);

export const metadata: Metadata = {
  title: 'Checklist',
  description: "5S TRANSPORTES",
  manifest: '/manifest.json',
  generator: "Next.js",
  authors: [
    {
      name: "carloshxh",
      url: "https://www.linkedin.com/in/carloshxh/",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "favicon/icon.png" },
    { rel: "icon", url: "favicon/icon.png" },
  ],
  keywords: ["nextjs", "next15", "pwa", "next-pwa"],
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

const BRANDING = {
  title: '5S TRANSPORTES',
  description: 'Checklist 5Stransportes',
  color: '#000000',
  colorScheme: 'dark',
  logo: <Image priority style={{ marginLeft: '28px', width: 'auto', height: '100%' }} src="/logo.png" alt="logo" width={120} height={80} />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="pt-BR" data-toolpad-color-scheme="dark" suppressHydrationWarning>
      <head>

        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />

      </head>
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeWrapper>
              <NextAppProvider
                branding={BRANDING}
                session={session}
                authentication={AUTHENTICATION}
              >
                {props.children}
              </NextAppProvider>
            </ThemeWrapper>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
