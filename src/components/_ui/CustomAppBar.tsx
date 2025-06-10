"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { usePathname, useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { AppBar as App, IconButton, Toolbar, Typography, Container, Box, Chip, Avatar, useTheme, useMediaQuery } from "@mui/material";
import { useSession } from '@toolpad/core/useSession';
import Image from "next/image";

function ToolbarAdmin() {
  return (
    <Stack direction="row">
      <IconButton href='/dashboard'><AdminPanelSettingsIcon /></IconButton>
    </Stack>
  );
}

function CustomAppTitle() {
  const router = useRouter()
  const path = usePathname();
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
       {path!='/' && (
        <IconButton type="button" color='inherit' aria-label="search" size="small" onClick={() => router.back()}>
          <ArrowBackIosIcon />
        </IconButton>
       )}
      <Image priority style={{ marginLeft: '10px', width: 58, height: 48 }} src="/logo.png" alt="logo" width={500} height={200} />
      <Typography color='white' variant="inherit" sx={{ fontWeight: '900',textShadow:'0px 0px 2px #fff' }}>CHECKLIST</Typography>
    </Stack>
  );
}

const ToolbarAccount = () => <IconButton onClick={() => signOut()}><LogoutIcon color='inherit' /></IconButton>

const CustomAppBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const session = useSession();

  return (
    <App component="nav" position='sticky' color='primary' sx={{boxShadow:'none'}}>
      <Container maxWidth={"xl"}>
        <Toolbar>
          <CustomAppTitle />
          <Box sx={{ flexGrow: 0, marginLeft: "auto", display: 'flex', gap: 2 }}>
            {!isMobile && <Chip
              sx={{ p: 0 }}
              avatar={<Avatar alt={session?.user?.name || ""} src={session?.user?.image || ""} />}
              label={session?.user?.name}
              variant="outlined"
            />}
            {(session?.user as any)?.role==="ADMIN"&&<ToolbarAdmin />}
            <ThemeSwitcher />
            <ToolbarAccount />
          </Box>
        </Toolbar>
      </Container>
    </App>
  );
};

export default CustomAppBar;
