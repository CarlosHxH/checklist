"use client"
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import CustomAppBar from '@/components/_ui/CustomAppBar';


function SidebarFooter() {
  return (
    <Box sx={{ mt: 'auto', textAlign: 'left' }}>
      <Typography variant="caption" sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{`© 2025 Made with love by CarlosHxH`}</Typography>
    </Box>
  );
}

export default function DashboardLayoutSlots(props: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <CustomAppBar />
      {props.children}
      <SidebarFooter />
    </React.Fragment>
  );
}