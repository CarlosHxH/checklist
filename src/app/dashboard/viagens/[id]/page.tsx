"use client";
import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';
import { formatDate } from '@/utils';
import { fetcher } from '@/lib/ultils';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Photos from '@/components/_ui/Photos';
import 'react-photo-view/dist/react-photo-view.css';

// Tipos baseados na API
interface Photo {
  id: string;
  inspectionId: string;
  description: string;
  photo: string;
  createdAt: string;
  type: string;
}

interface InspectionData {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleKey: string | null;
  dataInspecao?: string;
  status: 'INICIO' | 'FINAL';
  crlvEmDia: string;
  certificadoTacografoEmDia: string | null;
  nivelAgua: string;
  nivelOleo: string;
  eixo: string;
  dianteira: string;
  descricaoDianteira: string;
  tracao: string;
  descricaoTracao: string;
  truck: string;
  descricaoTruck: string;
  quartoEixo: string | null;
  descricaoQuartoEixo: string | null;
  avariasCabine: string;
  descricaoAvariasCabine: string | null;
  bauPossuiAvarias: string;
  descricaoAvariasBau: string | null;
  funcionamentoParteEletrica: string;
  descricaoParteEletrica: string | null;
  createdAt: string;
  updatedAt: string | null;
  kilometer: string;
  isFinished: boolean;
  extintor: string;
  photos: Photo[];
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  eixo: string;
  plate: string;
  createdAt: string;
  updatedAt: string | null;
  fixo: boolean;
  cidadeBase: string | null;
  tacografo: boolean;
}

interface User {
  name: string;
}

interface Inspection {
  id: string;
  userId: string;
  startId: string;
  endId: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  start: InspectionData;
  end: InspectionData;
  vehicle: Vehicle;
}

interface ApiResponse {
  inspections: Inspection;
}

const StyledStatus = styled(Chip)(({ theme, color }) => ({
  fontWeight: 'bold',
  color: color === 'success' ? theme.palette.success.main :
    color === 'warning' ? theme.palette.warning.main :
      theme.palette.error.main,
  backgroundColor: color === 'success' ? theme.palette.success.light :
    color === 'warning' ? theme.palette.warning.light :
      theme.palette.error.light,
}));

// Componente principal
const VehicleInspectionDetail: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useSWR<ApiResponse>(`/api/v2/dashboard/viagens/${id}`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Error loading data</div>;

  const { inspections: inspection } = data;
  const { vehicle, start, end, user } = inspection;

  const format = (dateString: string) => {
    const date = new Date(dateString);
    return formatDate(date);
  };

  const getStatusColor = (value: string) => {
    if (value === 'BOM' || value === 'NORMAL' || value === 'SIM') {
      return 'success';
    } else if (value === 'REGULAR') {
      return 'warning';
    } else {
      return 'error';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Relatório de Inspeção de Veículo
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <DirectionsCarIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </Typography>
              </Box>
              <Typography variant="body1">
                <strong>Placa:</strong> {vehicle.plate}
              </Typography>
              <Typography variant="body1">
                <strong>Eixos:</strong> {vehicle.eixo}
              </Typography>
              <Typography variant="body1">
                <strong>Tacógrafo:</strong> {vehicle.tacografo ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Inspetor: {user.name}</Typography>
              </Box>
              <Typography variant="body1">
                <strong>Data de Criação:</strong> {format(inspection.createdAt)}
              </Typography>
              <Typography variant="body1">
                <strong>Última Atualização:</strong> {format(inspection.updatedAt)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Seção de início da inspeção */}
        {start && <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ScheduleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Início da Inspeção</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              {start?.dataInspecao ? format(start.dataInspecao) : 'Data não disponível'}
            </Typography>

            <Typography variant="body1" mb={1}>
              <strong>Quilometragem:</strong> {Number(start.kilometer).toLocaleString()} km
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Documentação e Segurança
            </Typography>
            <Grid container spacing={1} mb={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">CRLV em Dia:</Typography>
                  <StyledStatus
                    label={start.crlvEmDia}
                    size="small"
                    color={getStatusColor(start.crlvEmDia)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Extintor:</Typography>
                  <StyledStatus
                    label={start.extintor}
                    size="small"
                    color={getStatusColor(start.extintor)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Níveis de Fluidos
            </Typography>
            <Grid container spacing={1} mb={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Água:</Typography>
                  <StyledStatus
                    label={start.nivelAgua}
                    size="small"
                    color={getStatusColor(start.nivelAgua)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Óleo:</Typography>
                  <StyledStatus
                    label={start.nivelOleo}
                    size="small"
                    color={getStatusColor(start.nivelOleo)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Pneus e Eixos
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Observação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Dianteira</TableCell>
                    <TableCell>
                      <StyledStatus
                        label={start.dianteira}
                        size="small"
                        color={getStatusColor(start.dianteira)}
                      />
                    </TableCell>
                    <TableCell>{start.descricaoDianteira || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tração</TableCell>
                    <TableCell>
                      <StyledStatus
                        label={start.tracao}
                        size="small"
                        color={getStatusColor(start.tracao)}
                      />
                    </TableCell>
                    <TableCell>{start.descricaoTracao || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Truck</TableCell>
                    <TableCell>
                      <StyledStatus
                        label={start.truck}
                        size="small"
                        color={getStatusColor(start.truck)}
                      />
                    </TableCell>
                    <TableCell>{start.descricaoTruck || "-"}</TableCell>
                  </TableRow>
                  {start.quartoEixo && (
                    <TableRow>
                      <TableCell>Quarto Eixo</TableCell>
                      <TableCell>
                        <StyledStatus
                          label={start.quartoEixo}
                          size="small"
                          color={getStatusColor(start.quartoEixo)}
                        />
                      </TableCell>
                      <TableCell>{start.descricaoQuartoEixo || "-"}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Avarias e Sistema Elétrico
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">Avarias na Cabine:</Typography>
                  <StyledStatus
                    label={start.avariasCabine}
                    size="small"
                    color={getStatusColor(start.avariasCabine === "NÃO" ? "SIM" : "NÃO")}
                    sx={{ ml: 1 }}
                  />
                </Box>
                {start.descricaoAvariasCabine && (
                  <Typography variant="body2" color="textSecondary">
                    {start.descricaoAvariasCabine}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">Avarias no Baú:</Typography>
                  <StyledStatus
                    label={start.bauPossuiAvarias}
                    size="small"
                    color={getStatusColor(start.bauPossuiAvarias === "NÃO" ? "SIM" : "NÃO")}
                    sx={{ ml: 1 }}
                  />
                </Box>
                {start.descricaoAvariasBau && (
                  <Typography variant="body2" color="textSecondary">
                    {start.descricaoAvariasBau}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">Parte Elétrica:</Typography>
                  <StyledStatus
                    label={start.funcionamentoParteEletrica}
                    size="small"
                    color={getStatusColor(start.funcionamentoParteEletrica)}
                    sx={{ ml: 1 }}
                  />
                </Box>
                {start.descricaoParteEletrica && (
                  <Typography variant="body2" color="textSecondary">
                    {start.descricaoParteEletrica}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {start.photos && start.photos.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Fotos
                </Typography>
                <Photos photos={start.photos.filter(d => d.type === "vehicle")} title={'Fotos do veiculo'} />
              </Box>
            )}
          </Paper>
        </Grid>}

        {/* Seção de fim da inspeção */}
        {end && <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ScheduleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Fim da Inspeção</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              {end?.dataInspecao ? format(end.dataInspecao) : 'Data não disponível'}
            </Typography>

            <Typography variant="body1" mb={1}>
              <strong>Quilometragem:</strong> {Number(end.kilometer).toLocaleString()} km
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Documentação e Segurança
            </Typography>
            <Grid container spacing={1} mb={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">CRLV em Dia:</Typography>
                  <StyledStatus
                    label={end.crlvEmDia}
                    size="small"
                    color={getStatusColor(end.crlvEmDia)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Extintor:</Typography>
                  <StyledStatus
                    label={end.extintor}
                    size="small"
                    color={getStatusColor(end.extintor)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Níveis de Fluidos
            </Typography>
            <Grid container spacing={1} mb={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Água:</Typography>
                  <StyledStatus
                    label={end.nivelAgua}
                    size="small"
                    color={getStatusColor(end.nivelAgua)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">Óleo:</Typography>
                  <StyledStatus
                    label={end.nivelOleo}
                    size="small"
                    color={getStatusColor(end.nivelOleo)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Pneus e Eixos
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Observação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Dianteira</TableCell>
                    <TableCell>
                      <StyledStatus
                        label={end.dianteira}
                        size="small"
                        color={getStatusColor(end.dianteira)}
                      />
                    </TableCell>
                    <TableCell>{end.descricaoDianteira || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tração</TableCell>
                    <TableCell>
                      <StyledStatus
                        label={end.tracao}
                        size="small"
                        color={getStatusColor(end.tracao)}
                      />
                    </TableCell>
                    <TableCell>{end.descricaoTracao || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Truck</TableCell>
                    <TableCell>
                      <StyledStatus
                        label={end.truck}
                        size="small"
                        color={getStatusColor(end.truck)}
                      />
                    </TableCell>
                    <TableCell>{end.descricaoTruck || "-"}</TableCell>
                  </TableRow>
                  {end.quartoEixo && (
                    <TableRow>
                      <TableCell>Quarto Eixo</TableCell>
                      <TableCell>
                        <StyledStatus
                          label={end.quartoEixo}
                          size="small"
                          color={getStatusColor(end.quartoEixo)}
                        />
                      </TableCell>
                      <TableCell>{end.descricaoQuartoEixo || "-"}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Avarias e Sistema Elétrico
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">Avarias na Cabine:</Typography>
                  <StyledStatus
                    label={end.avariasCabine}
                    size="small"
                    color={getStatusColor(end.avariasCabine === "NÃO" ? "SIM" : "NÃO")}
                    sx={{ ml: 1 }}
                  />
                </Box>
                {end.descricaoAvariasCabine && (
                  <Typography variant="body2" color="textSecondary">
                    {end.descricaoAvariasCabine}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">Avarias no Baú:</Typography>
                  <StyledStatus
                    label={end.bauPossuiAvarias}
                    size="small"
                    color={getStatusColor(end.bauPossuiAvarias === "NÃO" ? "SIM" : "NÃO")}
                    sx={{ ml: 1 }}
                  />
                </Box>
                {end.descricaoAvariasBau && (
                  <Typography variant="body2" color="textSecondary">
                    {end.descricaoAvariasBau}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">Parte Elétrica:</Typography>
                  <StyledStatus
                    label={end.funcionamentoParteEletrica}
                    size="small"
                    color={getStatusColor(end.funcionamentoParteEletrica)}
                    sx={{ ml: 1 }}
                  />
                </Box>
                {end.descricaoParteEletrica && (
                  <Typography variant="body2" color="textSecondary">
                    {end.descricaoParteEletrica}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {end.photos && end.photos.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Fotos
                </Typography>
                <Photos photos={end.photos.filter(d => d.type === "vehicle")} title={'Fotos do veiculo'} />
              </Box>
            )}
          </Paper>
        </Grid>}
      </Grid>

      {/*<Box mt={3} display="flex" justifyContent="center">
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<CheckCircleIcon />}
          sx={{ mr: 2 }}
        >
          Aprovar Inspeção
        </Button>
        <Button 
          variant="outlined" 
          color="warning" 
          startIcon={<WarningIcon />}
        >
          Solicitar Revisão
        </Button>
      </Box>*/}
    </Box>
  );
};

export default VehicleInspectionDetail;