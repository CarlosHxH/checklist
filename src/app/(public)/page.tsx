"use client"
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSession } from '@toolpad/core/useSession';
import Viagens from './PageViagens';
import Inspecao from './PageInspecao';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default function Page() {
  const theme = useTheme();
  const session = useSession();
  const [v, setValue] = React.useState(0);
  const idUser = session?.user?.id ?? '';

  const handleChange = React.useCallback((event: React.SyntheticEvent, i: number) => {
    setValue(i);
  }, []);

  return (
    <Box>
      <AppBar position="sticky" variant='elevation' color='primary' sx={{ boxShadow: '1px 1px 1px gray', zIndex: 1000 }}>
        <Tabs value={v} onChange={handleChange} indicatorColor="primary" textColor="inherit" variant="fullWidth" aria-label="Page-tabs">
          <Tab label={"VIAGENS"} sx={{ fontSize: '1rem', fontWeight: 'bold' }} />
          <Tab label={"INSPEÇÕES"} sx={{ fontSize: '1rem', fontWeight: 'bold' }} />
        </Tabs>
      </AppBar>
      <TabPanel value={v} index={0} dir={theme.direction}><Viagens id={idUser} /></TabPanel>
      <TabPanel value={v} index={1} dir={theme.direction}><Inspecao id={idUser} /></TabPanel>
    </Box>
  );
}