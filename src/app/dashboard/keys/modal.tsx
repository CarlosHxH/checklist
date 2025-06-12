import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

// Types
interface User {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
}

interface VehicleKey {
  id: string;
  userId: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  user: User;
  status: "CONFIRMED" | "PENDING" | "CONFIRMADO" | "PENDENTE";
  vehicle: Vehicle;
}

interface GroupedVehicleKeys {
  [vehicleId: string]: {
    vehicle: Vehicle;
    keys: VehicleKey[];
    vehicleKeys: VehicleKey[];
  };
}

interface FormData {
  userId: string;
  vehicleId: string;
  parentId?: string | null;
}

interface VehicleKeyTransferModalProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (formData: FormData) => Promise<void>;
  users: User[];
  vehicles: Vehicle[];
  groupedVehicleKeys: GroupedVehicleKeys;
  currentUserId?: string;
  isProcessing?: boolean;
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicleName?: string;
  userName?: string;
  isProcessing?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  vehicleName,
  userName,
  isProcessing = false
}) => (
  <Dialog open={open} onClose={() => !isProcessing && onClose()}>
    <DialogTitle>Confirmar Transferência</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Deseja transferir a chave do veículo <strong>{vehicleName}</strong> para <strong>{userName}</strong>?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={isProcessing}>
        Cancelar
      </Button>
      <Button onClick={onConfirm} variant="contained" disabled={isProcessing}>
        {isProcessing ? <CircularProgress size={24} /> : 'Confirmar'}
      </Button>
    </DialogActions>
  </Dialog>
);

const VehicleKeyTransferModal: React.FC<VehicleKeyTransferModalProps> = ({
  open,
  onClose,
  onTransfer,
  users,
  vehicles,
  groupedVehicleKeys,
  currentUserId,
  isProcessing = false
}) => {
  const [formData, setFormData] = useState<FormData>({ userId: '', vehicleId: '' });
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({ userId: '', vehicleId: '' });
      setError(null);
      setConfirmDialogOpen(false);
    }
  }, [open]);

  // Verificar se dados estão disponíveis
  if (!vehicles || !users) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Carregando...</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  // Helper functions
  const getCurrentKeyHolder = (vehicleId: string): string => {
    const group = groupedVehicleKeys[vehicleId];
    if (!group || !group.vehicleKeys || group.vehicleKeys.length === 0) {
      return 'Nenhum';
    }
    // Pegar a chave mais recente (primeira do array se estiver ordenado)
    const latestKey = group.vehicleKeys[0];
    return latestKey?.user?.name || 'Desconhecido';
  };

  const getCurrentKeyHolderId = (vehicleId: string): string | null => {
    const group = groupedVehicleKeys[vehicleId];
    if (!group || !group.vehicleKeys || group.vehicleKeys.length === 0) {
      return null;
    }
    const latestKey = group.vehicleKeys[0];
    return latestKey?.userId || null;
  };

  const validateForm = (): string | null => {
    if (!formData.vehicleId) return 'Selecione um veículo';
    if (!formData.userId) return 'Selecione um usuário';
    
    const currentHolderId = getCurrentKeyHolderId(formData.vehicleId);
    if (currentHolderId === formData.userId) {
      return 'A chave já está com este usuário';
    }
    
    return null;
  };

  // Event handlers
  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setConfirmDialogOpen(true);
  };

  const handleConfirmedSubmit = async () => {
    setConfirmDialogOpen(false);
    try {
      const submitData: FormData = { ...formData };
      
      // Adicionar parentId da chave atual se existir
      const group = groupedVehicleKeys[formData.vehicleId];
      if (group && group.vehicleKeys && group.vehicleKeys.length > 0) {
        submitData.parentId = group.vehicleKeys[0].id;
      }
      await onTransfer(submitData);
      onClose();
    } catch (error) {
      console.error('Error transferring vehicle key:', error);
      setError('Erro ao transferir a chave. Tente novamente.');
    }
  };

  const handleCloseModal = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  const handleVehicleChange = (event: SelectChangeEvent<string>) => {
    setError(null);
    setFormData({ ...formData, vehicleId: event.target.value, userId: '' });
  };

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setError(null);
    setFormData({ ...formData, userId: event.target.value });
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
  const selectedUser = users.find(u => u.id === formData.userId);
  const currentHolderId = getCurrentKeyHolderId(formData.vehicleId);

  return (
    <>
      {/* Main Transfer Dialog */}
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Nova Transferência de Chave</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel>Veículo</InputLabel>
            <Select
              value={formData.vehicleId}
              label="Veículo"
              onChange={handleVehicleChange}
              disabled={isProcessing}
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {`${vehicle.plate} - ${vehicle.model}`}
                  {formData.vehicleId === vehicle.id && 
                    ` (Atual: ${getCurrentKeyHolder(vehicle.id)})`
                  }
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Novo Responsável</InputLabel>
            <Select
              value={formData.userId}
              label="Novo Responsável"
              onChange={handleUserChange}
              disabled={isProcessing || !formData.vehicleId}
            >
              {users.map((user) => {
                const isCurrentHolder = currentHolderId === user.id;
                return (
                  <MenuItem
                    key={user.id}
                    value={user.id}
                    disabled={isCurrentHolder}
                  >
                    {user.name}
                    {isCurrentHolder && ' (Responsável Atual)'}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {formData.vehicleId && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Responsável atual: <strong>{getCurrentKeyHolder(formData.vehicleId)}</strong>
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={isProcessing}>
            Cancelar
          </Button>
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
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => !isProcessing && setConfirmDialogOpen(false)}
        onConfirm={handleConfirmedSubmit}
        vehicleName={selectedVehicle ? `${selectedVehicle.plate} - ${selectedVehicle.model}` : ''}
        userName={selectedUser?.name}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default VehicleKeyTransferModal;