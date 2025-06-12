"use client"
import React, { useState } from 'react';
import {
  Alert,
  Button
} from '@mui/material';
import VehicleKeyTransferModal from './modal';

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
  status: "CONFIRMED" | "PENDING";
  vehicle: Vehicle;
}

interface GroupedVehicleKeys {
  [vehicleId: string]: {
    vehicle: Vehicle;
    keys: VehicleKey[];
    latestKey: VehicleKey;
  };
}

const ExampleUsage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dados de exemplo
  const mockUsers: User[] = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Oliveira' },
    { id: '4', name: 'Ana Costa' }
  ];

  const mockVehicles: Vehicle[] = [
    { id: '1', plate: 'ABC-1234', model: 'Toyota Corolla' },
    { id: '2', plate: 'XYZ-5678', model: 'Honda Civic' },
    { id: '3', plate: 'DEF-9012', model: 'Volkswagen Gol' },
    { id: '4', plate: 'GHI-3456', model: 'Ford Ka' }
  ];

  const mockGroupedKeys: GroupedVehicleKeys = {
    '1': {
      vehicle: mockVehicles[0],
      keys: [],
      latestKey: {
        id: 'key1',
        userId: '1',
        vehicleId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: null,
        user: mockUsers[0],
        status: 'CONFIRMED',
        vehicle: mockVehicles[0]
      }
    },
    '2': {
      vehicle: mockVehicles[1],
      keys: [],
      latestKey: {
        id: 'key2',
        userId: '2',
        vehicleId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: null,
        user: mockUsers[1],
        status: 'PENDING',
        vehicle: mockVehicles[1]
      }
    },
    '3': {
      vehicle: mockVehicles[2],
      keys: [],
      latestKey: {
        id: 'key3',
        userId: '3',
        vehicleId: '3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: null,
        user: mockUsers[2],
        status: 'CONFIRMED',
        vehicle: mockVehicles[2]
      }
    }
  };

  const handleTransfer = async (formData: FormData) => {
    setIsProcessing(true);
    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Transferência realizada:', formData);
      setSuccessMessage('Chave transferida com sucesso!');
      
      // Simular atualização dos dados
      // Em um caso real, você faria mutate() ou refetch dos dados
    } catch (error) {
      console.error('Erro na transferência:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
          Gestão de Chaves de Veículos
        </h1>
        
        {successMessage && (
          <Alert 
            severity="success" 
            onClose={() => setSuccessMessage(null)}
            style={{ marginBottom: '16px' }}
          >
            {successMessage}
          </Alert>
        )}
        
        <Button 
          variant="contained"
          onClick={() => setModalOpen(true)}
          style={{ marginBottom: '24px' }}
          size="large"
        >
          Nova Transferência de Chave
        </Button>

        {/* Tabela simples para mostrar status atual */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Status Atual das Chaves</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Veículo</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Placa</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Responsável</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(mockGroupedKeys).map((group, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{group.vehicle.model}</td>
                  <td style={{ padding: '8px' }}>{group.vehicle.plate}</td>
                  <td style={{ padding: '8px' }}>{group.latestKey.user.name}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      backgroundColor: group.latestKey.status === 'CONFIRMED' ? '#e8f5e8' : '#fff3cd',
                      color: group.latestKey.status === 'CONFIRMED' ? '#2e7d32' : '#8a6d3b'
                    }}>
                      {group.latestKey.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <VehicleKeyTransferModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onTransfer={handleTransfer}
          users={mockUsers}
          vehicles={mockVehicles}
          groupedVehicleKeys={mockGroupedKeys}
          currentUserId="1"
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;