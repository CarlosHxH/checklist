"use client"
import React from 'react';
import {
  DataGrid, GridColDef, GridToolbar,
  GridRowParams, GridToolbarQuickFilter, GridToolbarContainer,
  GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport
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
  
  console.log('users', users);
  
  // Column definitions
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'NOME', flex: 1, minWidth: 90, valueFormatter: (v) => (v as string).toUpperCase() },
    { field: 'username', headerName: 'USUARIO', flex: 1, minWidth: 100 },
    { field: 'isActive', headerName: 'STATUS', flex: 1, type: 'singleSelect', valueOptions: ['active', 'inactive'],
      renderCell: (params) => <>{params.value ? <CheckIcon color='success' /> : <CloseIcon color='error' />}</>,
    },
    { field: 'actions', type: 'actions', headerName: 'AÇÕES', flex: 1, minWidth: 70,
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
        rows={users}
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