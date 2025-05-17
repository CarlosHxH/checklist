"use client";
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import Loading from '@/components/Loading';
import { Box, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';
import { PageContainer } from '@toolpad/core/PageContainer';

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
  const { data: inspections, error } = useSWR<Inspection[]>('/api/v2/dashboard/inspecao', fetcher);

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
        <Typography variant='subtitle2'>{params.formattedValue.plate}</Typography>
        <Typography variant='caption'>{params.formattedValue.model}</Typography>
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

  return (
      <PageContainer >
        <DataGrid
          rows={inspections}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 }
            }
          }}
          slots={{ toolbar: GridToolbar }}
          localeText={{
            toolbarColumns: "",
            toolbarFilters: "",
            toolbarExport: "",
            toolbarDensity: ""
          }}
          pageSizeOptions={[5, 10, 15, 25, 50, 75, 100]}
          rowSelection={false}
          getRowHeight={() => 'auto'}
          rowHeight={48}
        />
      </PageContainer >
  );
};

export default InspectionDashboard;