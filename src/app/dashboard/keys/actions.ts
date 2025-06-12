// actions.ts
import { DataModel, DataSource } from "@toolpad/core/Crud";
import axios from 'axios';

export interface Data extends DataModel {
  id: string;
  vehicle: string;
  username: string;
  status: string;
  userId?: string;
  vehicleId?: string;
  users?: any[];
  vehicles?: any[];
}

export const dataSource: DataSource<Data> &
  Required<Pick<DataSource<Data>, 'getMany' | 'updateOne' | 'getOne' | 'createOne' | 'deleteOne' | 'fields' | 'validate'>> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    {
      field: 'vehicle',
      headerName: 'VEICULO',
      flex: 1,
      type: 'singleSelect'
    },
    { field: 'username', headerName: 'USUÁRIO', width: 200 },
    { 
      field: 'status', 
      headerName: 'STATUS', 
      type: 'singleSelect', 
      valueOptions: ['PENDENTE', 'CONFIRMADO'], 
      width: 150 
    },
  ],
  
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    try {
      const response = await axios.get('/api/v2/dashboard/keys');
      const apiData = response.data;
      
      if (!apiData || !apiData.vehicleKeys) {
        return { items: [], itemCount: 0 };
      }

      const processedData = apiData.vehicleKeys.map((key: any) => ({
        id: key.id,
        vehicle: `${key.vehicle.plate} - ${key.vehicle.model}`,
        username: key.user.name || '',
        status: key.status,
        userId: key.user.id,
        vehicleId: key.vehicle.id,
        users: apiData.users || [],
        vehicles: apiData.vehicles || [],
      }));

      // Aplicar filtros se existirem
      let filteredData = processedData;
      if (filterModel && filterModel.items.length > 0) {
        filteredData = processedData.filter((item: any) => {
          return filterModel.items.every((filter: any) => {
            const value = item[filter.field];
            if (!value) return false;
            return value.toString().toLowerCase().includes(filter.value.toLowerCase());
          });
        });
      }

      // Aplicar ordenação se existir
      if (sortModel && sortModel.length > 0) {
        const sort = sortModel[0];
        filteredData.sort((a: any, b: any) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          if (sort.sort === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      // Aplicar paginação
      const start = paginationModel.page * paginationModel.pageSize;
      const end = start + paginationModel.pageSize;
      const paginatedData = filteredData.slice(start, end);

      return { 
        items: paginatedData, 
        itemCount: filteredData.length 
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { items: [], itemCount: 0 };
    }
  },

  deleteOne: async (keyId) => {
    try {
      const response = await axios.post(`/api/v2/keys/reject/${keyId}`);
      if (!response.status || response.status >= 400) {
        throw new Error('Erro ao deletar chave');
      }
      console.log(`Chave com id ${keyId} deletada com sucesso`);
    } catch (error) {
      console.error('Error deleting key:', error);
      throw error;
    }
  },

  getOne: async (id: string | number) => {
    try {
      const response = await axios.get(`/api/v2/dashboard/keys/${id}`);
      const key = response.data;
      return {
        id: key.id,
        vehicle: `${key.vehicle.plate} - ${key.vehicle.model}`,
        username: key.user.name || '',
        status: key.status,
        userId: key.user.id,
        vehicleId: key.vehicle.id,
        users: key.users || [],
        vehicles: key.vehicles || [],
      };
    } catch (error) {
      console.error('Error fetching key:', error);
      throw error;
    }
  },

  updateOne: async (id: string | number, data: Partial<Omit<Data, "id">>) => {
    try {
      // Para confirmar recebimento
      if (data.status === 'CONFIRMADO') {
        const response = await axios.post(`/api/v2/dashboard/keys/confirm/${id}`, {
          userId: data.userId
        });
        const key = response.data;
        return {
          id: key.id,
          vehicle: `${key.vehicle.plate} - ${key.vehicle.model}`,
          username: key.user.name || '',
          status: key.status,
          userId: key.user.id,
          vehicleId: key.vehicle.id,
          users: key.users || [],
          vehicles: key.vehicles || [],
        };
      }
      
      // Para outras atualizações
      const response = await axios.put(`/api/v2/dashboard/keys/${id}`, data);
      const key = response.data;
      return {
        id: key.id,
        vehicle: `${key.vehicle.plate} - ${key.vehicle.model}`,
        username: key.user.name || '',
        status: key.status,
        userId: key.user.id,
        vehicleId: key.vehicle.id,
        users: key.users || [],
        vehicles: key.vehicles || [],
      };
    } catch (error) {
      console.error('Error updating key:', error);
      throw error;
    }
  },

  createOne: async (data: Omit<Data, "id">) => {
    try {
      const response = await axios.post('/api/v2/dashboard/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const key = response.data;
      return {
        id: key.id,
        vehicle: `${key.vehicle.plate} - ${key.vehicle.model}`,
        username: key.user.name || '',
        status: key.status,
        userId: key.user.id,
        vehicleId: key.vehicle.id,
        users: key.users || [],
        vehicles: key.vehicles || [],
      };
    } catch (error) {
      console.error('Error creating key:', error);
      throw error;
    }
  },

  validate: async (data: Partial<Data>) => {
    const issues: { path: (string | number)[]; message: string }[] = [];
    
    if (!data.vehicle) {
      issues.push({ path: ['vehicle'], message: "Veículo é obrigatório" });
    }
    if (!data.username) {
      issues.push({ path: ['username'], message: "Usuário é obrigatório" });
    }
    if (!data.status) {
      issues.push({ path: ['status'], message: "Status é obrigatório" });
    }
    
    if (issues.length > 0) {
      return { issues };
    }
    
    return { value: data };
  },
};

// Função auxiliar para buscar dados adicionais (usuários e veículos)
export const getAdditionalData = async () => {
  try {
    const response = await axios.get('/api/v2/dashboard/keys');
    return {
      users: response.data.users || [],
      vehicles: response.data.vehicles || [],
      grouped: response.data.grouped || {}
    };
  } catch (error) {
    console.error('Error fetching additional data:', error);
    return { users: [], vehicles: [], grouped: {} };
  }
};