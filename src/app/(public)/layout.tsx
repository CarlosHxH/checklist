"use client"
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Notification from "@/components/_ui/UserNotification"
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function ToolbarActionsSearch() {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <Stack direction="row">
      {["ADMIN","USER"].includes(session?.user.role||"DRIVER") && (
        <IconButton onClick={() => router.push('/dashboard')}>
          <AdminPanelSettingsIcon/>
        </IconButton>
      )}

      <Tooltip title="Notification" enterDelay={1000}>
        <Notification />
      </Tooltip>
      
      <ThemeSwitcher/>
    </Stack>
  );
}

function SidebarFooter() {
  return (
    <Box sx={{ mt: 'auto', textAlign: 'left' }}>
      <Typography variant="caption" sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {`© 2025 Made with love by CarlosHxH`}
      </Typography>
    </Box>
  );
}

function CustomAppTitle() {
  const router = useRouter()
  const path = usePathname()

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {path != "/" ?
        <IconButton type="button" aria-label="search" size="small" onClick={() => router.back()}>
          <ArrowBackIosIcon/>
        </IconButton> : <></>}
      <Image priority style={{ marginLeft: '10px', width: 58, height: 48 }} src="/logo.png" alt="logo" width={500} height={200} />
      <Typography color='primary' variant="inherit" sx={{ fontWeight: '900' }}>CHECKLIST</Typography>
    </Stack>
  );
}

const ToolbarAccount = () => {
  return (
    <IconButton onClick={() => signOut()}>
      <LogoutIcon color='inherit'/>
    </IconButton>
  )
}

export default function DashboardLayoutSlots(props: { children: React.ReactNode }) {

  return (
    <DashboardLayout
      hideNavigation
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: ToolbarActionsSearch,
        toolbarAccount: ToolbarAccount
      }}
    >
      {props.children}
      <SidebarFooter />
    </DashboardLayout>
  );
}
