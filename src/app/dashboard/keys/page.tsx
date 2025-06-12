// page.tsx
'use client'
import * as React from 'react';
import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem, GridDataSource } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import { Close, History } from '@mui/icons-material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { PageContainer } from '@toolpad/core/PageContainer';
import VehicleKeyTransferModal from './modal';
import Swal from 'sweetalert2';
import HistoryModal, { HistoryModalProps } from '@/components/_ui/HistoryModal';
import CustomToolBar from '@/components/_ui/CustomToolBar';
import { Alert, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function GridToolbar() {
  const { data: session } = useSession();
  const { data, isLoading, mutate } = useSWR('/api/v2/dashboard/keys', fetcher)
  const [historyModalOpen, setHistoryModalOpen] = React.useState(false)
  const [historyView, setHistoryhistoryView] = React.useState<HistoryModalProps | any>()
  const [isMounted, setIsMounted] = React.useState(false);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [mesage, setMessage] = React.useState<{text:string;status:'success'|'error'} | null>();
  
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return;

  const handleTransfer = async (formData: any) => {
    setIsProcessing(true);
    try {
      if (formData.userId===session?.user.id) {
        const { data } = await axios.post(`/api/v2/dashboard/keys`, {...formData, newUser: session?.user.id})
      } else {
        const { data } = await axios.post(`/api/v2/dashboard/keys`, formData)
      }
      setMessage({text:'Chave transferida com sucesso!',status:'success'});
      mutate()
    } catch (error) {
      setMessage({text:'Erro ao fazer transferida!',status:'error'});
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiver = async ({id}: { id: string }) => {
    Swal.fire({
      title: "Deseja confirmar o recebimento desta chave?",
      showDenyButton: true,
      denyButtonText: `Não`,
      confirmButtonText: "Sim",
      confirmButtonColor: 'green',
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const userId = session?.user.id||''
        if (!userId) throw new Error('Erro ao Receber chave')
        const { data } = await axios.put(`/api/v2/dashboard/keys`, {id,userId})
        setMessage({text:'Transferência recebida com sucesso!',status:'success'});
      } catch (error) {
        setMessage({text:'Erro ao confirmar transferência',status:'error'});
      } finally {
        mutate();
      }
    });
  }

  const handleCancel = async (id: string) => {
    if (!id || !confirm("Deseja cancelar a transferência de chave?")) return
    try {
      const { data } = await axios.delete(`/api/v2/dashboard/keys/${id}`)
      setMessage({text:'Transferência deletada',status:'success'});
    } catch (error) {
      setMessage({text:'Erro ao rejeitar transferência.',status:'error'});
    } finally {
      mutate();
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'user', headerName: 'Usuário', flex: 1 },
    { field: 'vehicle', headerName: 'Veiculo', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      type: 'singleSelect',
      flex: 1,
      renderCell({ value }) {
        const statusMap = { 'CONFIRMED': 'RECEBIDO', 'PENDING': 'ENTREGA PENDENTE' };
        const colorMap = { 'CONFIRMED': 'success', 'PENDING': 'error' };
        const status = statusMap[value as keyof typeof statusMap] || value;
        const color = colorMap[value as keyof typeof colorMap] || value;
        return (<Typography pt={2} color={color}>{status}</Typography>);
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      flex: 1,
      maxWidth: 100,
      getActions: ({ row }: GridRowParams) => [
        ...((row.status === "PENDING"&& row.user != session?.user.name) ? [<GridActionsCellItem
          key="confirm"
          icon={<CheckBoxOutlineBlankIcon color='primary' />}
          label="Confirmar"
          onClick={() => {handleReceiver(row)}}
        />] : []),
        <GridActionsCellItem
          key={'historic'}
          onClick={() => {
            if (!data.grouped[row.vehicleId]) return;
            setHistoryhistoryView({...data.grouped[row.vehicleId], title: row.vehicle})
            setHistoryModalOpen(true)
          }}
          label="Histórico"
          icon={<History fontSize="small" />}
          disabled={isProcessing}
        />,
        ...((row.status === "PENDING"&& row.user != session?.user.name) ? [<GridActionsCellItem
          key="reject"
          icon={<Close color='error' />}
          label="Rejeitar"
          onClick={() => {handleCancel(row.id)}}
        />] : []),
      ]
    }
  ];
  const row = !!data ? data.last : []

  return (
    <PageContainer style={{ height: 400, width: '100%' }}>

      {mesage && <Alert color={mesage.status}>{mesage.text}</Alert>}

      <DataGrid
        columns={columns}
        rows={row}
        loading={isLoading}
        slots={{ toolbar: () => <CustomToolBar title={'Chaves'} onClickCreate={() => setModalOpen(true)} /> }}
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
            columnVisibilityModel: {
              'id': false
            }
          }
        }}
        pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}
      />

      <VehicleKeyTransferModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onTransfer={handleTransfer}
        users={data?.users || []}
        vehicles={data?.vehicles || []}
        groupedVehicleKeys={data?.grouped || []}
        currentUserId="1"
        isProcessing={isProcessing}
      />

      {historyModalOpen && (
        <HistoryModal open={historyModalOpen} onClose={() => setHistoryModalOpen(false)} data={historyView}/>
      )}

    </PageContainer>
  );
}