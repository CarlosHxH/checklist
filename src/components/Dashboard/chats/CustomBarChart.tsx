'use client';

import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Paper, Typography,  Alert, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useSWR from 'swr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos baseados no seu código existente
export type MonthlyInspectionData = {
  month: string;
  monthNumber: number;
  year: number;
  count: number;
  averagePerDay: number;
};

export type InspectionReport = {
  totalInspections: number;
  averagePerMonth: number;
  averagePerDay: number;
  monthlyData: MonthlyInspectionData[];
  chartData: any[];
  trends: any;
  insights: any;
};

// Props do componente
interface InspectionBarChartProps {
  title?: string;
  height?: number;
  showAverage?: boolean;
  period?: '6months' | '12months';
  apiEndpoint?: string;
}

// Fetcher para SWR
const fetcher = async (url: string): Promise<InspectionReport> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao carregar dados das inspeções');
  }
  return response.json();
};

// Hook customizado para dados das inspeções
function useInspectionData(endpoint: string) {
  const { data, error, isLoading, mutate } = useSWR<InspectionReport>(
    endpoint,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000, // Refresh a cada 5 minutos
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// Componente de Loading Skeleton
function ChartSkeleton({ height }: { height: number }) {
  return (
    <Box sx={{ width: '100%', height }}>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: height - 60 }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            sx={{
              flex: 1,
              height: `${Math.random() * 60 + 40}%`,
              borderRadius: 1,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// Componente principal
export default function InspectionBarChart({
  title = 'Inspeções por Mês',
  height = 400,
  showAverage = true,
  period = '12months',
  apiEndpoint = '/api/v2/dashboard/chart/lastYears'
}: InspectionBarChartProps) {
  const theme = useTheme();
  const { data, error, isLoading, mutate } = useInspectionData(apiEndpoint);

  // Processa os dados para o gráfico
  const processedData = React.useMemo(() => {
    if (!data?.monthlyData) return null;

    const monthlyData = period === '6months' 
      ? data.monthlyData.slice(-6) 
      : data.monthlyData;

    return {
      labels: monthlyData.map(item => 
        format(new Date(item.year, item.monthNumber - 1), 'MMM yy', { locale: ptBR })
      ),
      data: monthlyData.map(item => item.count),
      averageData: showAverage 
        ? Array(monthlyData.length).fill(data.averagePerMonth)
        : [],
      monthlyData,
    };
  }, [data, period, showAverage]);

  // Configurações do gráfico
  const chartConfig = React.useMemo(() => {
    if (!processedData) return null;

    const series = [
      {
        data: processedData.data,
        label: 'Inspeções',
        color: theme.palette.primary.main,
      }
    ];

    if (showAverage && processedData.averageData.length > 0) {
      series.push({
        data: processedData.averageData,
        label: 'Média',
        color: theme.palette.secondary.main,
      });
    }

    return {
      series,
      xAxis: [
        {
          data: processedData.labels,
          scaleType: 'band' as const,
        }
      ],
    };
  }, [processedData, theme, showAverage]);

  // Handlers
  const handleRefresh = () => {
    mutate();
  };

  // Estados de loading e error
  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <ChartSkeleton height={height} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Alert 
          severity="error" 
          action={
            <button onClick={handleRefresh} style={{ marginLeft: 8 }}>
              Tentar novamente
            </button>
          }
        >
          Erro ao carregar dados: {error.message}
        </Alert>
      </Paper>
    );
  }

  if (!data || !processedData || !chartConfig) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Alert severity="info">
          Nenhum dado disponível para exibir
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total: {data.totalInspections}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Média: {data.averagePerMonth.toFixed(1)}/mês
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height }}>
        <BarChart
          series={chartConfig.series}
          xAxis={chartConfig.xAxis}
          height={height}
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: 80,
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          grid={{ 
            horizontal: true, 
            vertical: false 
          }}
          sx={{
            '& .MuiBarChart-bar': {
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Última atualização: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </Typography>
        <button
          onClick={handleRefresh}
          style={{
            background: 'none',
            border: 'none',
            color: theme.palette.primary.main,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.75rem',
          }}
        >
          Atualizar
        </button>
      </Box>
    </Paper>
  );
}
/*tooltip={{
            formatter: (params: any) => {
              const dataIndex = params.dataIndex;
              const monthData = processedData.monthlyData[dataIndex];
                return [
                `Mês: ${monthData.month}`,
                `Inspeções: ${monthData.count}`,
                `Média diária: ${monthData.averagePerDay.toFixed(1)}`,
              ].join('\n');
            },
}}*/
// Componente wrapper para diferentes períodos
export function InspectionBarChartContainer() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <InspectionBarChart 
        title="Inspeções - Últimos 12 Meses"
        period="12months"
        height={400}
        showAverage={true}
      />
      
      <InspectionBarChart 
        title="Inspeções - Últimos 6 Meses"
        period="6months"
        height={300}
        showAverage={false}
      />
    </Box>
  );
}