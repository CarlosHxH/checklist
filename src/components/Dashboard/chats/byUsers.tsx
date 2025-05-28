'use client';
import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

const dataset = [
  [3, -7, 'Motorista 1'],
  [2, -5, 'Motorista 2'],
  [10, -10, 'Motorista 3'],
  [9, -6, 'Motorista 4'],
  [1, -5, 'Motorista 5'],
  [10, -10, 'Motorista 6'],
  [9, -6, 'Motorista 7'],
  [9, -6, 'Motorista 8'],
  [9, -6, 'Motorista 9'],
  [9, -6, 'Motorista 10'],
].map(([high, low, order]) => ({
  high,
  low,
  order,
}));

const chartSettingsH: Partial<BarChartProps> = {
  dataset,
  height: 300,
  yAxis: [{ scaleType: 'band', dataKey: 'order' }],
  slotProps: {
    legend: {
      direction: 'row',
      position: { vertical: 'bottom', horizontal: 'middle' },
    },
  },
};

const chartSettingsV: Partial<BarChartProps> = {
  ...chartSettingsH,
  xAxis: [{ scaleType: 'band', dataKey: 'order' }],
  yAxis: undefined,
};

export default function ChartByUsers() {

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Detalhes por Usuário
      </Typography>
      <BarChart
        series={[
          { dataKey: 'high', label: 'INICIADAS', stack: 'stack' },
          { dataKey: 'low', label: 'FINALIZADAS', stack: 'stack' },
        ]}
        {...(chartSettingsV)}
        borderRadius={5}
        margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
      />
    </Stack>
  );
}