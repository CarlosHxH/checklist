"use client"
import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import ThemeWrapper from '../ThemeWrapper';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { KeyOutlined } from '@mui/icons-material';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dashboard/keys',
    title: 'Chaves',
    icon: <KeyOutlined />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Análises',
  },
  {
    segment: 'dashboard/',
    title: 'Relatório',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'viagens',
        title: 'Viagens',
        icon: <LocalShippingIcon />,
      },
      {
        segment: 'inspecao',
        title: 'Inspeções',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'dashboard/users',
    title: 'Usúarios',
    icon: <LayersIcon />,
  },
  {
    segment: '',
    title: 'Checklist',
    icon: <LayersIcon />,
  },
];


const BRANDING = {
  title: '5S TRANSPORTES',
  logo: <Image priority style={{ marginLeft: '28px', width: 'auto', height: '100%' }} src="/logo.png" alt="logo" width={100} height={100} />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default function DashboardLayoutBasic(props: {children: React.ReactNode}) {
  const { children } = props;
  const {data: session} = useSession()
  return (
    <ThemeWrapper>
      <AppProvider branding={BRANDING} navigation={NAVIGATION} session={session} authentication={AUTHENTICATION}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </AppProvider>
    </ThemeWrapper>
  );
}
