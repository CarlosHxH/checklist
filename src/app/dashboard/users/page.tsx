"use client"
import React from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useMediaQuery, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import UserModal, { UserFormData } from './Forms';
import axios from 'axios';
import VerticalActions from '@/components/_ui/VerticalActions';
import CustomToolBar from '@/components/_ui/CustomToolBar';
import { PageContainer } from '@toolpad/core/PageContainer';

const UserDataGrid: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const { data: users, isLoading, mutate } = useSWR<UserFormData[]>('/api/v2/dashboard/users', fetcher);
  
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false)
  }, []);

  if (!isMounted) return;

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

  const xs = isMobile ? { year: false, eixo: false, model: false } : null
  return (
    <PageContainer style={{ height: 400, width: '100%' }}>

      <DataGrid
        columns={columns}
        rows={users}
        loading={isLoading}
        slots={{ toolbar: () => <CustomToolBar title={'Usuarios'} onClickCreate={() => setIsModalOpen(true)} /> }}
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
        pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}
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

    </PageContainer>
  );
};

export default UserDataGrid;