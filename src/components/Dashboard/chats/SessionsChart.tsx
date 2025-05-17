"use client"
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function SessionsChart() {
  const theme = useTheme();
  const [total,setTotal] = React.useState(0);
  const { data } = useSWR('/api/v2/dashboard/chart/lastMonth', fetcher);
  if(!data) return;


  React.useMemo(() => {
    if (data) {
      const totalDataSum = data.reduce((total: number, item: { data: number[] }) => {
        return total + item.data.reduce((sum, value) => sum + value, 0);
      }, 0);
      setTotal(totalDataSum);
    }
  }, [data]);
  

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Sessões
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {total}
            </Typography>
            <Chip size="small" color="success" label={`${(total*12/100)}%`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sessões por dia dos últimos 30 dias
          </Typography>
        </Stack>
        <LineChart
          series={data}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          {[0].map((_q,i)=>(
            <AreaGradient key={i} color={theme.palette.primary.main} id="referral" />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}