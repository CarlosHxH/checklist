'use client';
import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import { Box, Typography } from '@mui/material';

interface Props {
  dataset: {
    iniciadas: string;
    finalizada: string;
    motorista: string;
  }[] | any
}
export default function ChartByUsers({dataset}: Props) {
  if (!dataset) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography>Nenhum dado disponível</Typography>
      </Box>
    );
  }
  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Detalhes por Usuário
      </Typography>
      <BarChart
        dataset={dataset||[]}
        series={[
          { dataKey: 'iniciada', label: 'INICIADAS', stack: 'stack',},
          { dataKey: 'finalizada', label: 'FINALIZADAS', stack: 'stack' },
        ]}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
          },
        }}
        height={300}
        xAxis={[{ scaleType: 'band', dataKey: 'motorista', }]}
        yAxis={undefined}
        borderRadius={5}
        margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
      />
    </Stack>
  );
}