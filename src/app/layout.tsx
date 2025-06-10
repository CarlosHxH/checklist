import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import ThemeWrapper from './ThemeWrapper';
import Image from 'next/image';
import './page.module.css'
import type { Metadata } from 'next';

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
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'/>
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
