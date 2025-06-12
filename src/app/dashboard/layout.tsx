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
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';

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
    pattern: 'dashboard/keys{/:keyId}*',
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Análises',
  },
  {
    segment: 'dashboard/viagens',
    title: 'Viagens',
    icon: <LocalShippingIcon />,
  },
  {
    segment: 'dashboard/inspecao',
    title: 'Inspeções',
    icon: <DescriptionIcon />,
  },
  {
    segment: 'dashboard/users',
    title: 'Usúarios',
    icon: <LayersIcon />,
  },
  {
    segment: 'dashboard/vehicles',
    title: 'Veiculos',
    icon: <DirectionsCarFilledIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Aplicativo',
  },
  {
    segment: '../',
    title: 'Checklist',
    icon: <MobileFriendlyIcon />,
  },
];


const BRANDING = {
  title: 'TRANSPORTES',
  logo: <Image priority style={{ marginLeft: '28px', width: 'auto', height: '100%' }} src="/logo.png" alt="logo" width={100} height={100} />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default function DashboardLayoutBasic(props: {children: React.ReactNode}) {
  const {data: session} = useSession()
  return (
    <ThemeWrapper>
      <AppProvider branding={BRANDING} navigation={NAVIGATION} session={session} authentication={AUTHENTICATION}>
        <DashboardLayout>
          {props.children}
        </DashboardLayout>
      </AppProvider>
    </ThemeWrapper>
  );
}
