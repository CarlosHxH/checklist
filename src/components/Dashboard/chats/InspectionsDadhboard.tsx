import { useState, useEffect } from 'react';
import InspectionChart from './InspectionChart';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import type { InspectionChartData } from '@/services/inspectionService';

type DashboardData = {
  inspectionsByDate: InspectionChartData[];
  statusSummary: {
    finished: number;
    unfinished: number;
    total: number;
    finishedPercentage: number;
    unfinishedPercentage: number;
  };
};

export default function InspectionsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInspectionData = async () => {
      try {
        const response = await fetch('/api/v2/dashboard/chart/lastMonth');
        if (!response.ok) {
          throw new Error('Falha ao carregar dados');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar dados de inspeção:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInspectionData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="error">Erro ao carregar dados: {error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography>Nenhum dado disponível</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Últimos 30 Dias
            </Typography>
            <InspectionChart data={data.inspectionsByDate} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Total de Viagens
            </Typography>
            <Typography variant="h3">
              {data.statusSummary.finished}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              INICIADAS
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Total de Viagens
            </Typography>
            <Typography variant="h3">
              {data.statusSummary.unfinished}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              FINALIZADAS
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card style={{height:'100%'}}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Taxa de Finalização
            </Typography>
            <Typography variant="h3">
              {data.statusSummary.unfinishedPercentage||0}%
            </Typography>
            <Box sx={{mt:4}}>
              <Typography variant="subtitle1" color="textSecondary">
                {data.statusSummary.unfinished||0} de {data.statusSummary.total||0} inspeções finalizadas
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}