'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  Alert, Backdrop, Box, Button, Chip, CircularProgress, Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, useMediaQuery, useTheme
} from '@mui/material'
import { History } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import HistoryModal from '@/components/_ui/HistoryModal'
import useSWR from 'swr'
import { fetcher } from '@/lib/ultils'
import Loading from '@/components/Loading'
import { useSession } from 'next-auth/react'
import { formatDate } from '@/utils'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Swal from 'sweetalert2'

// Types
interface User {
  id: string
  name: string
}

interface Vehicle {
  id: string
  plate: string
  model: string
  vehicleKeys?: VehicleKey[]
}

interface VehicleKey {
  id: string;
  userId: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  user: User;
  status: "CONFIRMED" | "PENDING";
  vehicle: Vehicle;
}

interface DataType {
  users: User[];
  vehicles: Vehicle[];
  vehicleKeys: VehicleKey[];
}

interface GroupedVehicleKeys {
  [vehicleId: string]: {
    vehicle: Vehicle;
    keys: VehicleKey[];
    latestKey: VehicleKey;
  }
}

interface FormData {
  id?: string;
  userId: string;
  vehicleId: string;
}

export default function VehicleKeysPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { data: session } = useSession()

  // Data fetching
  const { data, isLoading, mutate } = useSWR<DataType>('/api/v2/dashboard/keys', fetcher, {
    refreshInterval: 7000, // Poll every 10 seconds instead of real-time socket updates
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })

  // State
  const [groupedVehicleKeys, setGroupedVehicleKeys] = useState<GroupedVehicleKeys>({})
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedVehicleKeys, setSelectedVehicleKeys] = useState<VehicleKey | null>(null)
  const [formData, setFormData] = useState<FormData>({ userId: '', vehicleId: '' })
  const [isProcessing, setIsProcessing] = useState(false)

  // Process data when it changes
  useEffect(() => {
    if (data && data.vehicleKeys.length > 0) {
      groupVehicleKeys()
    }
  }, [data, data?.vehicleKeys])

  // Helper functions
  const groupVehicleKeys = useCallback(() => {
    if (!data?.vehicleKeys) return;
    const grouped = data.vehicleKeys.reduce<GroupedVehicleKeys>((acc, key) => {
      if (!acc[key.vehicleId]) {
        acc[key.vehicleId] = {
          vehicle: {
            ...key.vehicle,
            vehicleKeys: data.vehicleKeys.filter(k => k.vehicleId === key.vehicleId)
          },
          keys: [],
          latestKey: key
        }
      }

      acc[key.vehicleId].keys.push(key)

      if (new Date(key.createdAt) > new Date(acc[key.vehicleId].latestKey.createdAt)) {
        acc[key.vehicleId].latestKey = key
      }

      return acc
    }, {})

    setGroupedVehicleKeys(grouped)
  }, [data])

  const validateForm = (): string | null => {
    if (!formData.vehicleId) return 'Selecione um veículo'
    if (!formData.userId) return 'Selecione um usuário'

    const currentKey = groupedVehicleKeys[formData.vehicleId]?.latestKey
    if (currentKey && currentKey.userId === formData.userId) {
      return 'A chave já está com este usuário'
    }

    return null
  }

  const getCurrentKeyHolder = (vehicleId: string) => {
    return groupedVehicleKeys[vehicleId]?.latestKey?.user?.name || 'Nenhum'
  }

  const getCurrentKeyStatusPending = (vehicleId: string) => {
    return groupedVehicleKeys[vehicleId]?.latestKey?.status === "PENDING"
  }

  // Event handlers
  const handleSubmit = () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    setConfirmDialogOpen(true)
  }

  const handleConfirmedSubmit = async () => {
    setConfirmDialogOpen(false)
    setIsProcessing(true)

    try {
      if (formData.userId === session?.user.id) {
        formData.id = session?.user.id;
      }

      const response = await fetch('/api/v2/dashboard/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: groupedVehicleKeys[formData.vehicleId]?.latestKey?.id || null
        }),
      })

      if (!response.ok) throw new Error('Erro ao transferir chave')

      await response.json();
      setSuccessMessage('Chave transferida com sucesso!')
      handleCloseModal()
      mutate()
    } catch (error) {
      console.error('Error creating vehicle key:', error)
      setError('Erro ao transferir a chave. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseModal = () => {
    setOpen(false)
    setError(null)
    setFormData({ userId: '', vehicleId: '' })
  }

  const handleCancelNotification = async (latestKey: VehicleKey) => {
    if (!confirm("Deseja cancelar a transferência de chave?")) return
    if (!latestKey) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/v1/keys/reject/${latestKey.id}`, { method: 'POST' })
      if (!response.ok) throw new Error('Erro ao rejeitar transferência')
      mutate()
    } catch (error) {
      setError('Erro ao rejeitar transferência')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpenHistoryModal = (vehicleKey: VehicleKey) => {
    setSelectedVehicleKeys(vehicleKey)
    setHistoryModalOpen(true)
  }

  const handleReceiveKey = async (vehicleId: string) => {
    Swal.fire({
      title: "Deseja confirmar o recebimento desta chave?",
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: `Não`
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      const latestKey = groupedVehicleKeys[vehicleId]?.latestKey;
      if (!latestKey) return;
      setIsProcessing(true)
      try {
        const response = await fetch(`/api/v2/dashboard/keys/confirm/${latestKey.id}`, {
          method: 'POST',
          body: JSON.stringify({ userId: session?.user.id })
        })
        if (!response.ok) throw new Error('Erro ao confirmar transferência')
        mutate()
        setSuccessMessage('Transferência confirmada com sucesso!')
      } catch (error) {
        setError('Erro ao confirmar transferência')
      } finally {
        setIsProcessing(false)
      }

    });
  }

  if (isLoading) return <Loading />

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5">Gestão de Chaves</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Nova Transferência</Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Responsável Atual</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data recebimento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(groupedVehicleKeys).map((group, i) => {
              const status = group.latestKey.status
              const title = status === 'CONFIRMED' ? 'CONFIRMADO' : 'ENTREGA PENDENTE'
              const color = status === 'CONFIRMED' ? 'success' : 'error'
              if (status === 'CONFIRMED') return;

              return (
                <TableRow key={i} sx={{ bgcolor: 'rgba()' }}>
                  <TableCell>
                    <IconButton
                      title='Receber chave'
                      onClick={() => handleReceiveKey(group.vehicle.id)}
                      disabled={isProcessing}
                    >
                      <CheckBoxOutlineBlankIcon color='primary' />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>{group.latestKey.user.name}</TableCell>
                  <TableCell>{group.vehicle.model}</TableCell>
                  <TableCell>{group.vehicle.plate}</TableCell>
                  <TableCell><Chip label={title} color={color} /></TableCell>
                  <TableCell>{formatDate(new Date(group.latestKey.createdAt), "dd/MM/yyyy HH:mm:ss")}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        onClick={() => handleOpenHistoryModal(group.latestKey)}
                        title="Histórico"
                        disabled={isProcessing}
                      >
                        <History fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>{group.keys.length}</Typography>
                      </IconButton>
                      {status === 'PENDING' && (
                        <IconButton
                          onClick={() => handleCancelNotification(group.latestKey)}
                          title="Cancelar notificação"
                          sx={{ ml: 1 }}
                          disabled={isProcessing}
                        >
                          <CloseIcon fontSize="small" color="error" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transfer Dialog */}
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Nova Transferência de Chave</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel>Veículo</InputLabel>
            <Select
              value={formData.vehicleId}
              label="Veículo"
              onChange={(e) => {
                setError(null)
                setFormData({ ...formData, vehicleId: e.target.value })
              }}
              disabled={isProcessing}
            >
              {data?.vehicles?.map((v) => {
                if (getCurrentKeyStatusPending(v.id)) return null
                return (
                  <MenuItem key={v.id} value={v.id}>
                    {`${v.plate} - ${v.model}`}
                    {formData.vehicleId === v.id && ` (Atual: ${getCurrentKeyHolder(v.id)})`}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Novo Responsável</InputLabel>
            <Select
              value={formData.userId}
              label="Novo Responsável"
              onChange={(e) => {
                setError(null)
                setFormData({ ...formData, userId: e.target.value })
              }}
              disabled={isProcessing}
            >
              {data?.users?.map((u) => (
                <MenuItem
                  key={u.id}
                  value={u.id}
                  disabled={groupedVehicleKeys[formData.vehicleId]?.latestKey?.userId === u.id}
                >
                  {u.name}
                  {groupedVehicleKeys[formData.vehicleId]?.latestKey?.userId === u.id && ' (Responsável Atual)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={isProcessing}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.userId || !formData.vehicleId || isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Transferir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => !isProcessing && setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmar Transferência</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja transferir a chave do veículo {
              formData.vehicleId && data?.vehicles.find(v => v.id === formData.vehicleId)?.model
            } para {
              formData.userId && data?.users.find(u => u.id === formData.userId)?.name
            }?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={isProcessing}>Cancelar</Button>
          <Button onClick={handleConfirmedSubmit} variant="contained" disabled={isProcessing}>
            {isProcessing ? <CircularProgress size={24} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Modal */}
      {selectedVehicleKeys && (
        <HistoryModal
          open={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          vehicleKeys={groupedVehicleKeys[selectedVehicleKeys.vehicleId]}
        />
      )}

      {/* Success Message */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }} open={isProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}