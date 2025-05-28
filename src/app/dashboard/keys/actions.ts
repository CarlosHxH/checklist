import { DataModel, DataSource } from "@toolpad/core/Crud";
import axios from 'axios';
export interface Data extends DataModel {
  id: string;
  vehicle: string;
  username: string;
  status: string;
  vehicles?: any[];
  users?: any[];
}

let data: Data[] = [];

export const dataSource: DataSource<Data> &
  Required<Pick<DataSource<Data>, 'getMany' | 'updateOne' | 'getOne' | 'createOne' | 'deleteOne' | 'fields' | 'validate'>> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    {
      field: 'vehicle',
      headerName: 'VEICULO',
      flex: 1,
      type: 'singleSelect',
      editable: true,
    },
    { field: 'username', headerName: 'USUÁRIO', width: 200, editable: true, valueOptions: [] },
    { field: 'status', headerName: 'STATUS', type: 'singleSelect', editable: true, valueOptions: ['PENDENTE', 'CONFIRMADO'], width: 150 },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    try {
      const response = await axios.get('/api/v2/dashboard/keys');
      const apiData = response.data;
      data = apiData || [];
      if (!apiData) {
        return { items: [], itemCount: 0 };
      }

      const processedPeople = (apiData?.vehicleKeys || []).map((key: any) => ({
        id: key.id,
        vehicle: key.vehicle.plate + " - " + key.vehicle.model,
        username: key.user.name || '',
        status: key.status || 'PENDING',
        users: key.user || [],
        vehicles: key.vehicles || [],
      }));

      const start = paginationModel.page * paginationModel.pageSize;
      const end = start + paginationModel.pageSize;
      const paginatedPeople = processedPeople.slice(start, end);

      return { items: paginatedPeople, itemCount: processedPeople.length };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { items: [], itemCount: 0 };
    }
  },
  deleteOne: async (personId) => {
    try {
      await axios.delete(`/api/v2/dashboard/keys/reject/${personId}`);
      console.log(`Item with id ${personId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },
  getOne: async (id: string | number) => {
    const response = await axios.get(`/api/v2/dashboard/keys/${id}`);
    const key = response.data;
    return {
      id: key.id,
      vehicle: key.vehicle.plate + " - " + key.vehicle.model,
      username: key.user.name || '',
      status: key.status,
      users: key.user || [],
      vehicles: key.vehicles || [],
    };
  },
  updateOne: async (id: string | number, data: Partial<Omit<Data, "id">>) => {
    const response = await axios.put(`/api/v2/dashboard/keys/${id}`, data);
    const key = response.data;
    return {
      id: key.id,
      vehicle: key.vehicle.plate + " - " + key.vehicle.model,
      username: key.user.name || '',
      status: key.status,
      users: key.user || [],
      vehicles: key.vehicles || [],
    };
  },
  createOne: async (data: Omit<Data, "id">) => {
    const response = await axios.post(`/api/v2/dashboard/keys`, data);
    const key = response.data;
    return {
      id: key.id,
      vehicle: key.vehicle.plate + " - " + key.vehicle.model,
      username: key.user.name || '',
      status: key.status,
      users: key.user || [],
      vehicles: key.vehicles || [],
    };
  },
  validate: async (data: Partial<Data>) => {
    // Example validation: check required fields
    const issues: { path: (string | number)[]; message: string }[] = [];
    if (!data.vehicle) issues.push({ path: ['vehicle'], message: "Vehicle is required" });
    if (!data.username) issues.push({ path: ['username'], message: "Username is required" });
    if (!data.status) issues.push({ path: ['status'], message: "Status is required" });
    if (issues.length > 0) {
      return { issues };
    }
    return { value: data };
  },
};