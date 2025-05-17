'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Collapse, IconButton, Table, TableBody, Paper,
  TableCell, TableContainer, TableHead, TableRow, Typography,
  Chip, TextField, MenuItem, FormControl, InputLabel, Toolbar,
  Select, Stack, Pagination, InputAdornment, Grid, SelectChangeEvent,
  Tooltip,
  Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import useSWR from 'swr';
import { fetcher, formatDate } from '@/lib/ultils';
import Loading from '@/components/Loading';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import StatusUpdateModal from './Modal';
import { useInspectionUpdate } from '@/hooks/useInspectionUpdate';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// Definição do tipo para os dados
interface VehicleInspection {
  id: string;
  userId: string;
  startId: string;
  endId: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
  start: {
    id: string;
    userId: string;
    vehicleId: string;
    vehicleKey: string | null;
    dataInspecao: string;
    status: string;
    crlvEmDia: string;
    certificadoTacografoEmDia: string;
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
  };
  end: {
    id: string;
    userId: string;
    vehicleId: string;
    vehicleKey: string | null;
    dataInspecao: string;
    status: string;
    crlvEmDia?: string;
    certificadoTacografoEmDia: string;
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
  };
  vehicle: {
    make: string;
    plate: string;
    model: string;
  }
}

// Tipos para os filtros
interface FilterOptions {
  status: string;
  responsavel: string;
  periodo: string;
  placa: string;
}

// Componente de linha da tabela (Row)
function Row(props: { row: VehicleInspection }) {
  const router = useRouter();
  const { row } = props;
  const [open, setOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  // Use our custom hook
  const { updateStatus, loading } = useInspectionUpdate(row.id, {
    onSuccess: () => {
      alert('Status atualizado com sucesso!');
      setModalOpen(false);
    },
    onError: (error: any) => {
      alert(error.message || 'Erro ao atualizar status');
      setModalOpen(false);
    }
  });


  // Check if there are any issues to fix
  const hasIssues = () => {

    const startIssues = row?.start && (
      row.start.nivelAgua != 'NORMAL' ||
      row.start.nivelOleo != 'NORMAL' ||
      row.start.avariasCabine === 'SIM' ||
      row.start.bauPossuiAvarias === 'SIM' ||
      row.start.funcionamentoParteEletrica === 'RUIM' ||

      row?.start?.dianteira === 'RUIM' ||
      row?.start?.tracao === 'RUIM' ||
      row?.start?.truck === 'RUIM' ||
      row?.start?.quartoEixo === 'RUIM'
    );

    const endIssues = row?.end && (
      row.end.nivelAgua != 'NORMAL' ||
      row.end.nivelOleo != 'NORMAL' ||
      row.end.avariasCabine === 'SIM' ||
      row.end.bauPossuiAvarias === 'SIM' ||
      row.end.funcionamentoParteEletrica === 'RUIM' ||

      row?.end?.dianteira === 'RUIM' ||
      row?.end?.tracao === 'RUIM' ||
      row?.end?.truck === 'RUIM' ||
      row?.end?.quartoEixo === 'RUIM'
    );

    return startIssues || endIssues;
  };


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.user.name}
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant='subtitle2'>{row.vehicle.plate}</Typography>
          <Typography variant='caption'>{row.vehicle.model}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography sx={{ display: 'block' }} variant='caption'>
            {row?.start?.createdAt && 'Inicial: ' + formatDate(row.start.createdAt)}
          </Typography>
          <Typography color={row?.end ? 'textPrimary' : 'warning'} sx={{ display: 'block' }} variant='caption'>
            {row?.end?.createdAt ? 'Final: ' + formatDate(row?.end?.createdAt) : 'Em andamento'}
          </Typography>
        </TableCell>
        <TableCell align="right">{row?.start?.kilometer || 0} km</TableCell>
        <TableCell align="right">{row?.end?.kilometer || 0} km</TableCell>

        <TableCell align="right">
          <Box>
            <Tooltip title="Visualizar">
              <IconButton size="small" onClick={() => router.push(`/dashboard/viagens/${row.id}`)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            
            {hasIssues() && (
              <Tooltip title="Corrigir Problemas/Avarias">
                <IconButton 
                  size="small" 
                  onClick={() => setModalOpen(true)} 
                  color="warning"
                >
                  <ReportProblemIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>

      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalhes da Viagem
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Inicio da Viagem:
                    {row.start?.dataInspecao ? formatDate(row.start.dataInspecao) : 'Data não disponível'}
                  </Typography>
                  <Table size="small" aria-label="inspection-start">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>CRLV</TableCell>
                        <TableCell>{row?.start?.crlvEmDia || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Certificado Tacógrafo</TableCell>
                        <TableCell>{row?.start?.certificadoTacografoEmDia || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nível de Água</TableCell>
                        <TableCell>{row?.start?.nivelAgua || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nível de Óleo</TableCell>
                        <TableCell>{row?.start?.nivelOleo || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pneus Dianteiros</TableCell>
                        <TableCell>{row?.start?.dianteira || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pneus Tração</TableCell>
                        <TableCell>{row?.start?.tracao || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Truck</TableCell>
                        <TableCell>{row?.start?.truck || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avarias Cabine</TableCell>
                        <TableCell>{row?.start?.avariasCabine || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avarias Baú</TableCell>
                        <TableCell>{row?.start?.bauPossuiAvarias || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Parte Elétrica</TableCell>
                        <TableCell>{row?.start?.funcionamentoParteEletrica || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Extintor</TableCell>
                        <TableCell>{row?.start?.extintor || ''}</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </Box>

                {row?.end && <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Final da Viagem: {row.end?.dataInspecao ? formatDate(row?.end?.dataInspecao) : 'Data não disponível'}
                  </Typography>
                  <Table size="small" aria-label="inspection-end">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>CRLV</TableCell>
                        <TableCell>{row?.end?.crlvEmDia || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Certificado Tacógrafo</TableCell>
                        <TableCell>{row?.end?.certificadoTacografoEmDia || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nível de Água</TableCell>
                        <TableCell>{row?.end?.nivelAgua || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nível de Óleo</TableCell>
                        <TableCell>{row?.end?.nivelOleo || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pneus Dianteiros</TableCell>
                        <TableCell>{row?.end?.dianteira || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pneus Tração</TableCell>
                        <TableCell>{row?.end?.tracao || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Truck</TableCell>
                        <TableCell>{row?.end?.truck || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avarias Cabine</TableCell>
                        <TableCell>{row?.end?.avariasCabine || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avarias Baú</TableCell>
                        <TableCell>{row?.end?.bauPossuiAvarias || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Parte Elétrica</TableCell>
                        <TableCell>{row?.end?.funcionamentoParteEletrica || ''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Extintor</TableCell>
                        <TableCell>{row?.end?.extintor || ''}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <StatusUpdateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        inspectionData={{
          ...row,
          vehicle: {
            ...row.vehicle,
            id: row.vehicleId
          }
        }}
        onSave={updateStatus}
        loading={loading}
      />
    </React.Fragment>
  );
}

// Componente principal da tabela
export default function CollapsibleTable() {
  // Fix for the Hook order issue - declare all state hooks first
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({ status: '', responsavel: '', periodo: '', placa: '' });
  const [filteredRows, setFilteredRows] = useState<VehicleInspection[]>([]);

  // Data fetching with SWR - moved after state declarations
  const { data: allRows, isLoading } = useSWR<VehicleInspection[]>('/api/v2/dashboard/viagens', fetcher);

  // Apply filters effect
  useEffect(() => {
    if (allRows) {
      let result = [...allRows];

      // Aplicar busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();

        result = result.filter(row =>
          (row.user?.name?.toLowerCase() || "").includes(searchLower) ||
          (String(row?.start?.kilometer || "")).toLowerCase().includes(searchLower) ||
          (String(row?.end?.kilometer || "")).toLowerCase().includes(searchLower) ||
          (row?.vehicle?.model?.toLowerCase() || "").includes(searchLower) ||
          (row?.vehicle?.plate?.toLowerCase() || "").includes(searchLower)
        );
      }

      // Aplicar filtros
      if (filters.placa) {
        result = result.filter(row => row.vehicle.plate === filters.placa);
      }

      // Aplicar filtros
      if (filters.responsavel) {
        result = result.filter(row => row.user.name === filters.responsavel);
      }

      if (filters.periodo) {
        const today = new Date();
        const filterDate = new Date();

        switch (filters.periodo) {
          case 'hoje':
            result = result.filter(row => new Date(row.createdAt).toDateString() === today.toDateString());
            break;
          case 'semana':
            filterDate.setDate(today.getDate() - 7);
            result = result.filter(row => new Date(row.createdAt) >= filterDate);
            break;
          case 'mes':
            filterDate.setMonth(today.getMonth() - 1);
            result = result.filter(row => new Date(row.createdAt) >= filterDate);
            break;
          default:
            break;
        }
      }

      if (filters.status) {
        switch (filters.status) {
          case 'avarias':
            result = result.filter(row =>
              row?.start?.avariasCabine === 'SIM' ||
              row?.start?.bauPossuiAvarias === 'SIM' ||
              row?.end?.avariasCabine === 'SIM' ||
              row?.end?.bauPossuiAvarias === 'SIM'
            );
            break;
          case 'problemas':
            result = result.filter(row =>
              row?.start?.nivelAgua === 'BAIXO' ||
              row?.start?.nivelOleo === 'BAIXO' ||
              row?.end?.nivelAgua === 'BAIXO' ||
              row?.end?.nivelOleo === 'BAIXO'
            );
            break;
          default: break;
        }
      }

      setFilteredRows(result);
    }
  }, [searchTerm, filters, allRows]);

  // Return early with loading state
  if (isLoading) return <Loading />;
  
  // Return nothing if data is not available
  if (!allRows) return null;

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  // Obter linhas da página atual
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Manipuladores de eventos
  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Resetar para primeira página após busca
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Resetar para primeira página após filtro
  };

  // Obter lista de responsáveis únicos para o filtro
  const responsaveis = Array.from(new Set(allRows && allRows.map(row => row.user.name)));
  const placas = Array.from(new Set(allRows && allRows.map(row => row.vehicle.plate)));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Barra de busca e filtros */}
      <Toolbar sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Buscar"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Pesquisar por responsável, KM..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel id="responsavel-filter-label">Responsável</InputLabel>
                <Select
                  labelId="responsavel-filter-label"
                  name="responsavel"
                  value={filters.responsavel}
                  label="Responsável"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {responsaveis.map(resp => (
                    <MenuItem key={resp} value={resp}>{resp}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="responsavel-filter-label">Placa</InputLabel>
                <Select
                  labelId="responsavel-filter-label"
                  name="placa"
                  value={filters.placa}
                  label="Placa"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {placas.map(placa => (
                    <MenuItem key={placa} value={placa}>{placa}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="periodo-filter-label">Período</InputLabel>
                <Select
                  labelId="periodo-filter-label"
                  name="periodo"
                  value={filters.periodo}
                  label="Período"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="hoje">Hoje</MenuItem>
                  <MenuItem value="semana">Últimos 7 dias</MenuItem>
                  <MenuItem value="mes">Último mês</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="avarias">Com avarias</MenuItem>
                  <MenuItem value="problemas">Com problemas</MenuItem>
                </Select>
              </FormControl>

              <Button fullWidth sx={{ minWidth: 90 }} variant='contained' color='primary' onClick={() => console.log(filteredRows)/*CSVExporter.export(filteredRows)*/}>
                Exportar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>

      {/* Tabela */}
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Responsável</TableCell>
              <TableCell>Veiculo</TableCell>
              <TableCell align="right">Data</TableCell>
              <TableCell align="right">KM Inicial</TableCell>
              <TableCell align="right">KM Final</TableCell>
              <TableCell align="right">Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <Row key={row.id} row={row} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhum registro encontrado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
        />

      </Box>

      {/* Indicador de resultados */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando {paginatedRows.length} de {filteredRows.length} registros
          {searchTerm || filters.responsavel || filters.periodo || filters.status ? ' (filtrados)' : ''}
        </Typography>
      </Box>
    </Paper>
  );
}