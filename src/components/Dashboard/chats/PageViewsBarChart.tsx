"use client"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { fetcher } from '@/lib/ultils';

export default function PageViewsBarChart() {
  const [total,setTotal] = React.useState(0);
  
  const { data, isLoading } = useSWR('/api/v2/dashboard/barchart',fetcher);
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];
  React.useMemo(() => {
    if (data) {
      const totalDataSum = data.reduce((total: number, item: { data: number[] }) => {
        return total + item.data.reduce((sum, value) => sum + value, 0);
      }, 0);
      setTotal(totalDataSum);
    }
  }, [data]);

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
            sx={{alignContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center',gap: 1 }}>
            <Typography variant="h4" component="p">
              {total}
            </Typography>
            <Chip size="small" color={(total*12/100)>1?"success":"error"} label={`${(total*12/100)}%`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Periodo de 2025
          </Typography>
        </Stack>
        
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: 'band',
                data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
              },
            ]
          }
          series={data||[]}
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