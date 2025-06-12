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
import { Alert } from '@mui/material';

export default function GridToolbar() {
  const { data, isLoading, mutate } = useSWR('/api/v2/dashboard/keys', fetcher)
  const [historyModalOpen, setHistoryModalOpen] = React.useState(false)
  const [historyView, setHistoryhistoryView] = React.useState<HistoryModalProps | any>()
  const [isMounted, setIsMounted] = React.useState(false);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return;

  const handleTransfer = async (formData: any) => {
    setIsProcessing(true);
    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await fetch('/api/v2/dashboard/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      })
      setSuccessMessage('Chave transferida com sucesso!');
      mutate()
    } catch (error) {
      console.error('Erro na transferência:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiver = async ({ id, userId }: { id: string, userId: string }) => {
    Swal.fire({
      title: "Deseja confirmar o recebimento desta chave?",
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: `Não`
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      setIsProcessing(true)
      try {
        const response = await fetch(`/api/v2/dashboard/keys/confirm/${id}`, {
          method: 'POST',
          body: JSON.stringify({ userId })
        })
        if (!response.ok) throw new Error('Erro ao confirmar transferência')
        mutate()
        setSuccessMessage('Transferência confirmada com sucesso!')
      } catch (error) {
        setSuccessMessage('Erro ao confirmar transferência')
      } finally {
        setIsProcessing(false)
      }

    });
  }

  const handleCancel = async (id: string) => {

    if (!confirm("Deseja cancelar a transferência de chave?")) return
    if (!id) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/v2/keys/reject/${id}`, { method: 'POST' })
      if (!response.ok) throw new Error('Erro ao rejeitar transferência')
      setSuccessMessage('Transferência deletada')
      mutate()
    } catch (error) {
      setSuccessMessage('Erro ao rejeitar transferência.')
    } finally {
      setIsProcessing(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'user.name', headerName: 'Usuário', flex: 1 },
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
        return (<Typography color={color}>{status}</Typography>);
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      flex: 1,
      maxWidth: 100,
      getActions: ({ row }: GridRowParams) => [
        ...(row.status === "PENDING" ? [<GridActionsCellItem
          key="confirm"
          icon={<CheckBoxOutlineBlankIcon color='primary' />}
          label="Confirmar"
          onClick={() => {
            handleReceiver(row)
          }}
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
        <GridActionsCellItem
          key="reject"
          icon={<Close color='error' />}
          label="Rejeitar"
          onClick={() => {
            console.log('Reject:', row)
            handleCancel(row.id)
          }
          }
        />
      ]
    }
  ];
  const row = !!data ? data.last : []

  return (
    <PageContainer style={{ height: 400, width: '100%' }}>

      {successMessage && <Alert>{successMessage}</Alert>}

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