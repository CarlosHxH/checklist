import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { 
  Close, 
  CarRental,
  Person,
  AccessTime
} from '@mui/icons-material';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

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
  id: string
  userId: string
  vehicleId: string
  createdAt: string
  updatedAt: string
  parentId: string | null
  user: User
  vehicle: Vehicle
  status: "CONFIRMED" | "REJECTED" | "PENDING";
}

interface HistoryModalProps {
  open: boolean
  onClose: () => void
  vehicleKeys: {
    vehicle: Vehicle
    keys: VehicleKey[]
    latestKey: VehicleKey
  } | null
}

const HistoryModal = ({ 
  open, 
  onClose, 
  vehicleKeys 
}: HistoryModalProps) => {
  if (!vehicleKeys) return null;

  // Sort keys from most recent to oldest
  const sortedKeys = [...vehicleKeys.keys].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Histórico do Veículo:
            <Typography>
              <strong> {vehicleKeys.vehicle.model} - {vehicleKeys.vehicle.plate}</strong>
            </Typography>
          </Typography>
          <Close onClick={onClose} sx={{ cursor: 'pointer' }} />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Timeline sx={{position:'relative',left:-30}}>
          {sortedKeys.map((key, index) => (
            <TimelineItem key={key.id}>
              <TimelineSeparator>
                <TimelineDot color={index === 0 ? 'primary' : 'grey'}>
                  {index === 0 ? <CarRental /> : <Person />}
                </TimelineDot>
                {index < sortedKeys.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              
              <TimelineContent>
                <Paper 
                  elevation={index === 0 ? 3 : 1}
                  sx={{ 
                    p: 2, 
                    borderLeft: `4px solid ${index === 0 ? 'primary.main' : 'grey.500'}` 
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography 
                      variant="subtitle1" 
                      color={index === 0 ? 'primary.main' : 'text.secondary'}
                    >
                      {index === 0 ? 'Transferência Atual' : `Transferência ${index + 1}`}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">
                        {new Date(key.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Responsável: <b>{key.user.name}</b>
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                  {key.status==="CONFIRMED"?"CONFIRMOU A CHAVE":"CONFIRMAÇÃO PENDENTE" }
                  </Typography>
                  
                  <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Placa:</strong> {key.vehicle.plate}...
                    </Typography>
                    {key.status && (
                      <Typography variant="body2">
                        <strong>Status:</strong> {key.status}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;