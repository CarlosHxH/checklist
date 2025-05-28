"use client"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { fetcher } from '@/lib/ultils';

export default function PageViewsBarChart() {

  const { data, isLoading } = useSWR('/api/v2/dashboard/chart/lastYears', fetcher);
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];

  if (isLoading) return <Loading />;


  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Inspeções anual
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{ alignContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" component="p">
              {data.count}
            </Typography>
            {/*<Chip size="small" color={(total*12/100)>1?"success":"error"} label={`${(total*12/100)}%`} />*/}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Periodo de {new Date().getFullYear()}
          </Typography>
        </Stack>

        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                data: data.labels,
                scaleType: 'band' as const,
              }
            ]
          }
          series={data.series || []}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}