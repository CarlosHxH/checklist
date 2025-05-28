"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataModel, DataSource, DataSourceCache, List } from '@toolpad/core/Crud';
import axios from 'axios';


export interface Data extends DataModel {
  id: string;
  vehicle: string;
  username: string;
  status: string;
}

let data: Data[] = [];

export const peopleDataSource: DataSource<Data> &
  Required<Pick<DataSource<Data>, 'getMany'>> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'vehicle', headerName: 'VEICULO', flex: 1, type: 'singleSelect', editable: true, valueOptions: ['PENDING', 'CONFIRMED'] },
    { field: 'username', headerName: 'USUÁRIO', width: 200, editable: true, valueOptions: ['PENDING', 'CONFIRMED'] },
    { field: 'status', headerName: 'STATUS', type: 'singleSelect', editable: true, valueOptions: ['PENDING', 'CONFIRMED'], width: 150 },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    // Simulate loading delay
    const data = await axios.get('/api/v2/dashboard/keys').then(res => res.data);
    if (!data) {
      return { items: [], itemCount: 0 };
    }

    let processedPeople = [...data?.vehicleKeys || []].map((key: any) => ({
      id: key.id,
      vehicle: key.vehicle.plate + " - " + key.vehicle.model,
      username: key.user.name || '',
      status: key.status || 'PENDING',
    }));
    /*
        if (filterModel?.items?.length) {
          filterModel.items.forEach(({ field, value, operator }) => {
            if (!field || value == null) {
              return;
            }
            processedPeople = processedPeople.filter((person) => {
              const personValue = data[field];
              switch (operator) {
                case 'contains':
                  return String(personValue)
                    .toLowerCase()
                    .includes(String(value).toLowerCase());
                case 'equals':
                  return personValue === value;
                case 'startsWith':
                  return String(personValue)
                    .toLowerCase()
                    .startsWith(String(value).toLowerCase());
                case 'endsWith':
                  return String(personValue)
                    .toLowerCase()
                    .endsWith(String(value).toLowerCase());
                case '>':
                  return (personValue as number) > value;
                case '<':
                  return (personValue as number) < value;
                default:
                  return true;
              }
            });
          });
        }
    /*
        if (sortModel?.length) {
          processedPeople.sort((a, b) => {
            for (const { field, sort } of sortModel) {
              if ((a[field] as number) < (b[field] as number)) {
                return sort === 'asc' ? -1 : 1;
              }
              if ((a[field] as number) > (b[field] as number)) {
                return sort === 'asc' ? 1 : -1;
              }
            }
            return 0;
          });
        }*/

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedPeople = processedPeople.slice(start, end);

    return { items: paginatedPeople, itemCount: processedPeople.length };
  },
  deleteOne: async (personId) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    data = data.filter((person) => person.id !== String(personId));
  },
};


const cache = new DataSourceCache();

export default function CrudListDataGrid() {

  const handleRowClick = React.useCallback((personId: string | number) => {
    console.log(`Row click with id ${personId}`);
  }, []);

  const handleCreateClick = React.useCallback(() => {
    console.log('Create click');
  }, []);

  const handleEditClick = React.useCallback((personId: string | number) => {
    console.log(`Edit click with id ${personId}`);
  }, []);

  const handleDelete = React.useCallback((personId: string | number) => {
    console.log(`Person with id ${personId} deleted`);
  }, []);

  return (
    <List<Data>
      dataSource={peopleDataSource}
      dataSourceCache={cache}
      onRowClick={handleRowClick}
      onCreateClick={handleCreateClick}
      onEditClick={handleEditClick}
      onDelete={handleDelete}
      slots={{ dataGrid: DataGrid }}
      initialPageSize={10}
      slotProps={{
        dataGrid: {
          initialState: {
            pinnedColumns: { right: ['actions'] },
            pagination: { paginationModel: { pageSize: 10 } },
            columns: {
              columnVisibilityModel: { id: false, vehicle: true, username: true, status: true },
            },
          },
        },
      }}
    />
  );
}
