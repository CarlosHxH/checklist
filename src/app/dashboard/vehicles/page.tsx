"use client"
import React from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useMediaQuery, useTheme } from '@mui/material';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import axios from 'axios';
import VehicleModal, { vehicleFormData } from './Forms';
import VerticalActions from '@/components/_ui/VerticalActions';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomToolBar from '@/components/_ui/CustomToolBar';

// Vechicle interface definition
const VechicleDataGrid: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: vehicles, isLoading, mutate } = useSWR<vehicleFormData[]>('/api/v2/dashboard/vehicles', fetcher);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [paginationModel, setPaginationModel] = React.useState({ pageSize: 10, page: 0 });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleDelete = (id: string) => {
    if (vehicles) {
      if (confirm(`Temcerteza que deseja deletar o veiculo: ${vehicles.find(Vechicle => Vechicle.id === id)?.plate}`)) {
        axios.delete(`/api/v2/dashboard/vehicles/${id}`)
          .then(function (response) {
            console.log({ response });
            mutate();
          })
          .catch(function (error) {
            alert(error.response.data);
          });
      }
    }
  };

  if (!isMounted) return;

  // Column definitions
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'make', headerName: 'FABRICANTE', flex: 1 },
    { field: 'plate', headerName: 'PLACA', flex: 1 },
    { field: 'model', headerName: 'MODELO', flex: 1},
    { field: 'year', headerName: 'ANO', flex: 1},
    { field: 'eixo', headerName: 'EIXOS', flex: 1, valueFormatter: (v) => isMobile ? v : ['DIANTEIRA', 'TRAÇÃO', 'TRUCK', '4° Eixo'][--v] },
    { field: 'tacografo', headerName: 'TACOGRAFO', flex: 1, valueFormatter: (v) => v ? "SIM" : "NÃO" },
    { field: 'cidadeBase', headerName: 'BASE', flex: 1, valueFormatter: (v) => v ? "SIM" : "NÃO" },
    {
      field: 'actions', type: 'actions', headerName: 'Ações', flex: .6,
      getActions: ({ row }: GridRowParams) => [
        <VerticalActions
          key={row.id}
          isMobile={isMobile}
          params={row}
          handleEdit={() => {
            setSelected(row);
            setIsModalOpen(true);
          }}
          handleDelete={handleDelete} />
      ]
    }
  ];

  const xs = isMobile ? { 'make': false,'year': false,'tacografo': false,'cidadeBase': false } : null
  return (
    <PageContainer>
      <DataGrid
        rows={vehicles}
        columns={columns}
        loading={isLoading}
        slots={{ toolbar: () => <CustomToolBar title={'Veiculo'} onClickCreate={() => setIsModalOpen(true)} /> }}
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
            paginationModel: { pageSize: 25, page: 0 },
          },
          columns: {
            columnVisibilityModel: {'id': false, ...xs }
          }
        }}
        pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}
        pagination
      />

      

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
        data={selected}
        onSubmit={async (data) => { await mutate() }}
      />
    </PageContainer>
  );
};

export default VechicleDataGrid;
/*
<DataGrid
        rows={vehicles}
        columns={columns}
        loading={isLoading}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        slots={{ toolbar: () => <CustomToolBar title={'Veiculos'} onClickCreate={() => setIsModalOpen(true)} /> }}
        localeText={{
          toolbarColumns: "",
          toolbarFilters: "",
          toolbarExport: "",
          toolbarDensity: ""
        }}
        autoHeight
        density="standard"
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
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
      />
/*function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport slotProps={{ tooltip: { sx: { width: 100 } }, button: { sx: { width: 50 } } }} />
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" spacing={2} alignItems={'center'}>
        <GridToolbarQuickFilter />
        <Button onClick={() => setIsModalOpen(true)} variant="contained" size='large' color="primary">Novo</Button>
      </Stack>
    </GridToolbarContainer>
  );
}*/
//GridToolbar