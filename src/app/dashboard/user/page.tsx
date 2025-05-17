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
import UserModal, { UserFormData } from './Forms';
import axios from 'axios';
import VerticalActions from '@/components/_ui/VerticalActions';

const UserDataGrid: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: users, isLoading, mutate } = useSWR<UserFormData[]>('/api/v2/dashboard/users', fetcher);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [paginationModel, setPaginationModel] = React.useState({ pageSize: 10, page: 0 });

  const handleDelete = (id: string) => {
    if (users) {
      if (confirm(`Temcerteza que deseja deletar o usuário: ${users.filter(user => user.id === id)[0]?.name}`)) {
        axios.delete(`/api/v2/dashboard/users/${id}`)
          .then(function (res) {
            mutate();
          })
          .catch(function (error) {
            alert(error.response.data);
          });
      }
    }
  };

  const role = {
    ADMIN: 'ADMIN',
    USER: 'USUARIO',
    DRIVER: 'MOTORISTA'
  }
  // Column definitions
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'NOME', flex: isMobile ? 2 : 3, minWidth: 90, valueFormatter: (v) => (v as string).toUpperCase() },
    { field: 'username', headerName: 'USUARIO', flex: isMobile ? 1 : 0.8, minWidth: 100 },
    { field: 'role', headerName: 'PERFIL', flex: 1, minWidth: 80, valueFormatter: (v) => role[v]},
    { field: 'isActive', headerName: 'STATUS', flex: isMobile ? 1 : 2, type: 'singleSelect', valueOptions: ['active', 'inactive'],
      renderCell: (params) => <>{params.value ? <CheckIcon color='success' /> : <CloseIcon color='error' />}</>,
    },
    { field: 'actions', type: 'actions', headerName: 'AÇÕES', flex: 1, minWidth: 70,
      getActions: ({ row }: GridRowParams) => [
        <VerticalActions key={row.id as string}
          isMobile={isMobile}
          params={row}
          handleEdit={() => {
            setSelectedUser(row);
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
        <GridToolbarExport printOptions={{disableToolbarButton:true}} csvOptions={{ allColumns: true }} slotProps={{ tooltip: { title: '', sx: { width: 100 } }, button: { sx: { width: 50 } } }} />
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
        rows={users}
        columns={columns}
        loading={isLoading}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
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
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={async () => { await mutate() }}
      />

    </Box>
  );
};

export default UserDataGrid;