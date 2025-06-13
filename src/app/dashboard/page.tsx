"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import StatCard, { StatCardProps } from "@/components/Dashboard/chats/StatCard";
import CustomTreeView from "@/components/Dashboard/chats/CustomTreeView";
import ChartByVehicle from "@/components/Dashboard/chats/ChartByVehicle";
import Loading from "@/components/Loading";
import useSWR from "swr";
import { fetcher } from "@/lib/ultils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import InspectionsDashboard from "@/components/Dashboard/chats/InspectionsDadhboard";
import InspectionBarChart from "@/components/Dashboard/chats/CustomBarChart";
import ChartByUsers from "@/components/Dashboard/chats/byUsers";

export default function DashboardContent() {
  const router = useRouter();
  const { data, isLoading } = useSWR("/api/v2/dashboard", fetcher);
  
  if (isLoading || !data) return <Loading />;
  if(data.error) return <></>;

  const redirect = (url: string) => {
    let redirectUrl = '';
    if (url === 'Usuários') { redirectUrl = '/dashboard/user'; }
    if (url === 'Viagens') { redirectUrl = '/dashboard/viagens'; }
    if (url === 'Inspeções') { redirectUrl = '/dashboard/inspecao'; }
    if (url === 'Veiculos') { redirectUrl = '/dashboard/vehicle'; }
    router.push(redirectUrl);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={(theme: any) => ({ flexGrow: 1 })} >
        <Stack
          spacing={2}
          sx={{ alignItems: "center", mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}
        >
          <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>Visão geral</Typography>

            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
              {data.cards && data.cards.map((card: StatCardProps, index: number) => (
                <Grid key={index} size={{ xs: 6, sm: 3, lg: 3 }} onClick={() => redirect(card.title)} sx={{ cursor: "pointer" }}>
                  <StatCard {...card} />
                </Grid>
              ))}

              <Grid size={{ xs: 12, md: 12 }}>
                <Box>
                  <React.Suspense fallback={
                    <Box sx={{ mt: 4 }}>
                      <Skeleton variant="rectangular" height={300} />
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Skeleton variant="rectangular" height={150} width="50%" />
                        <Skeleton variant="rectangular" height={150} width="50%" />
                      </Box>
                    </Box>
                  }>
                    <Box mt={4}>
                      <InspectionsDashboard />
                    </Box>
                  </React.Suspense>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <InspectionBarChart 
                  title="Visão Geral - Últimos 12 Meses"
                  height={440}
                  showAverage={true}
                  period="12months"
                />
              </Grid>

              {false && <Grid size={{ xs: 12, sm: 6, lg: 6 }}><ChartByVehicle /></Grid>}
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}><ChartByUsers dataset={data.byUsers}/></Grid>

            {false && (
              <>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                  Detalhes
                </Typography>
                <Grid container spacing={2} columns={12}>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Stack gap={2} direction={{ xs: "column", sm: "row" }}>
                      <CustomTreeView />
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}


/*
const exportToCSV = () => {
  if (!data) return;
  const csvRows = [];
  // Adiciona o cabeçalho
  csvRows.push(['Mês', 'Valor']);
  // Adiciona os dados
  data.forEach((item: any, index: number) => {
    const month = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index];
    item.data.forEach((value: any) => {
      csvRows.push([month, value]);
    });
  });
  // Cria um blob e inicia o download
  const csvString = csvRows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', 'true');
  a.setAttribute('href', url);
  a.setAttribute('download', 'dados_inspecoes.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
*/