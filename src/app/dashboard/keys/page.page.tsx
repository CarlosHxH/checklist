"use client"
import React from 'react';
import {
  DataGrid, GridColDef, GridToolbar,
  GridRowParams, GridToolbarQuickFilter, GridToolbarContainer,
  GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { Box, Button,  Stack, useMediaQuery, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import axios from 'axios';
import VerticalActions from '@/components/_ui/VerticalActions';

const UserDataGrid: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, isLoading, mutate } = useSWR<any>('/api/v2/dashboard/keys', fetcher);
  const {users, vehicleKeys,vehicles} = data || { users: [], vehicleKeys: [], vehicles: [] };
  
  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  
  // Column definitions
  const columns: GridColDef[] = [
    {
      field: 'vehicle',
      headerName: 'VEICULO',
      flex: 1,
      minWidth: 90,
      editable: true,
      type: 'singleSelect',
      valueOptions: vehicles.map((v:any) => ({ value: v.id, label: `${v.plate} - ${v.model}` })),
      renderCell: (params: GridRenderCellParams) => {
        const vehicle = vehicles.find((v:any) => v.id === params.value.id);
        return <>{vehicle ? `${vehicle.plate} - ${vehicle.model}` : 'N/A'}</>;
      }
    },
    {
      field: 'user',
      headerName: 'USUARIO', flex: .8, minWidth: 100, valueGetter: (value, row) => row.user.name },

    {
      field: 'status',
      headerName: 'STATUS',
      flex: .3,
      type: 'singleSelect',
      valueOptions: ['CONFIRMED', 'PENDING'],
      editable: true,
      renderCell: (params) => <>{params.value ? "ENTREGUE" : "PENDENTE"}</>,
    },
    { field: 'actions', type: 'actions', headerName: 'AÇÕES', flex: .3, minWidth: 70,
      getActions: ({ row }: GridRowParams) => [
        <VerticalActions key={row.id as string}
          isMobile={isMobile}
          params={row}
          handleEdit={() => {}}
          handleDelete={()=>{}} />
      ]
    }
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport printOptions={{disableToolbarButton:true}} csvOptions={{ allColumns: true }} slotProps={{ tooltip: { title: '', sx: { width: 100 } }, button: { sx: { width: 50 } } }} />
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2} alignItems={'center'}>
          <GridToolbarQuickFilter variant="outlined" size="small" />
          <Button onClick={()=>{}} variant="contained" size='large' color="primary">Novo</Button>
        </Stack>
      </GridToolbarContainer>
    );
  }

  const xs = isMobile ? { year: false, eixo: false, model: false } : null
  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={vehicleKeys}
        columns={columns}
        loading={isLoading}
        pagination
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar || GridToolbar }}
        localeText={{
          toolbarColumns: "",
          toolbarFilters: "",
          toolbarExport: "",
          toolbarDensity: "",
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
          columns: {
            columnVisibilityModel: { ...xs },
          },
        }}
        density="standard"
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '& .status-active': { color: 'green', fontWeight: 'bold' },
          '& .status-inactive': { color: 'red', fontWeight: 'bold' }
        }}
        pageSizeOptions={[10, 15, 20, 50, { value: -1, label: 'Todos' }]}
      />
    </Box>
  );
};

export default UserDataGrid;