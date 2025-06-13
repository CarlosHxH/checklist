"use client";
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import Loading from '@/components/Loading';
import { Box, Chip, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomToolBar from '@/components/_ui/CustomToolBar';

interface Vehicle {
  plate: string;
  model: string;
}

interface Inspection {
  id: string;
  createdAt: string;
  status: string;
  kilometer: string;
  crlvEmDia: string;
  certificadoTacografoEmDia: string;
  nivelAgua: string;
  nivelOleo: string;
  avariasCabine: string;
  bauPossuiAvarias: string;
  funcionamentoParteEletrica: string;
  extintor: string;
  isFinished: boolean;
  vehicle: Vehicle;
}

const InspectionDashboard: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { data: inspections, error, isLoading } = useSWR<Inspection[]>('/api/v2/dashboard/inspecao', fetcher);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const StatusChip: React.FC<{ value: string }> = ({ value }) => {
    const getChipProps = () => {
      switch (value) {
        case 'BOM':
        case 'NORMAL':
        case 'SIM': return { color: 'success' as const, label: value };
        case 'RUIM':
        case 'BAIXO':
        case 'NÃO': return { color: 'error' as const, label: value };
        case 'CRITICO': return { color: 'error' as const, label: value, variant: 'outlined' as const };
        default: return { color: 'default' as const, label: value };
      }
    };
    return <Chip size="small" {...getChipProps()} />;
  };

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Data',
      width: 100,
      valueFormatter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'vehicle',
      headerName: 'Veículo',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (<Box>
        <Typography variant='subtitle2'>{params.formattedValue.plate} - {params.formattedValue.model}</Typography>
      </Box>
      ),
    },
    {
      field: 'kilometer',
      headerName: 'KM',
      width: 80,
    },
    {
      field: 'crlvEmDia',
      headerName: 'CRLV',
      width: 100,
      renderCell: (params: GridRenderCellParams) => <StatusChip value={params.value} />,
    },
    {
      field: 'certificadoTacografoEmDia',
      headerName: 'Tacógrafo',
      width: 100,
      renderCell: (params: GridRenderCellParams) => <StatusChip value={params.value} />,
    },
    {
      field: 'nivelAgua',
      headerName: 'Agua',
      width: 100,
      renderCell: (params: GridRenderCellParams) => <StatusChip value={params.value} />,
    },
    {
      field: 'nivelOleo',
      headerName: 'Oleo',
      width: 100,
      renderCell: (params: GridRenderCellParams) => <StatusChip value={params.value} />,
    },
    {
      field: 'extintor',
      headerName: 'Extintor',
      width: 80,
      renderCell: (params: GridRenderCellParams) => <StatusChip value={params.value} />,
    },
    {
      field: 'user',
      headerName: 'Usuario',
      width: 110,
      valueGetter: (value, row) => `${row.user.name}`
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 55,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton size="small" onClick={() => router.push(`/dashboard/inspecao/${params.row.id}`)}>
              <Visibility />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (error) return <div>Erro ao carregar as inspeções</div>;
  if (!inspections) return <Loading />;
  const xs = isMobile ? { year: false, eixo: false, model: false } : null
  return (
    <PageContainer style={{ height: 400, width: '100%' }}>

      <DataGrid
        rows={inspections}
        columns={columns}
        loading={isLoading}
        slots={{ toolbar: () => <CustomToolBar title={'INSPEÇÃO DE VIAGEM'} /> }}
        showToolbar
        autoPageSize
        localeText={{
          toolbarQuickFilterPlaceholder: 'Pesquisar...',
        }}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
          columns: {
            columnVisibilityModel: { ...xs },
          },
        }}
        pageSizeOptions={[10, 50, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}
      />
    </PageContainer>
    
  );
};

export default InspectionDashboard;