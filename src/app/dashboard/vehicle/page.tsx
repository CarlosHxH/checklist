"use client"
import React from 'react';
import {
  DataGrid, GridColDef, GridToolbar,
  GridRowParams, GridToolbarQuickFilter, GridToolbarContainer,
  GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport
} from '@mui/x-data-grid';
import { Box, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import axios from 'axios';
import VehicleModal, { vehicleFormData } from './Forms';
import VerticalActions from '@/components/_ui/VerticalActions';

// Vechicle interface definition
const VechicleDataGrid: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: vehicles, isLoading, mutate } = useSWR<vehicleFormData[]>('/api/v2/dashboard/vehicles', fetcher);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [paginationModel, setPaginationModel] = React.useState({ pageSize: 10, page: 0 });

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

  // Column definitions
  const columns: GridColDef[] = [
    { field: 'make', headerName: 'FABRICANTE', flex: isMobile ? 1 : 0.8, maxWidth: 120 },
    { field: 'plate', headerName: 'PLACA', flex: isMobile ? 1 : 2, minWidth: 80 },
    { field: 'model', headerName: 'MODELO', flex: isMobile ? 1 : 0.8, maxWidth: 100 },
    { field: 'year', headerName: 'ANO', flex: isMobile ? 1 : 0.8, maxWidth: 60 },
    { field: 'eixo', headerName: 'EIXOS', flex: isMobile ? 1 : 0.8, maxWidth: 80, valueFormatter: (v) => isMobile ? v : ['DIANTEIRA', 'TRAÇÃO', 'TRUCK', '4° Eixo'][--v] },
    { field: 'tacografo', headerName: 'TACOGRAFO', flex: isMobile ? 1 : 0.8, maxWidth: 120, valueFormatter: (v) => v ? "SIM" : "NÃO" },
    { field: 'cidadeBase', headerName: 'BASE', flex: 1, maxWidth: 180 },
    {
      field: 'actions', type: 'actions', headerName: 'Ações', flex: 1, maxWidth: 70,
      getActions: ({ row }: GridRowParams) => [
        <VerticalActions key={row.id as string}
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

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport slotProps={{ tooltip: { sx: { width: 100 } }, button: { sx: { width: 50 } } }} />
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2} alignItems={'center'}>
          <GridToolbarQuickFilter variant="outlined" size="small" />
          <Button onClick={() => setIsModalOpen(true)} variant="contained" size='large' color="primary">Novo</Button>
        </Stack>
      </GridToolbarContainer>
    );
  }

  const xs = isMobile ? { year: false, eixo: false, model: false } : null
  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={vehicles}
        columns={columns}
        loading={isLoading}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar || GridToolbar }}
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

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
        data={selected}
        onSubmit={async (data) => { await mutate() }}
      />

    </Box>
  );
};

export default VechicleDataGrid;