"use client"
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Create, DataSourceCache, Edit, List } from '@toolpad/core/Crud';
import { Data, dataSource } from './actions';
import { PageContainer } from '@toolpad/core/PageContainer';

const cache = new DataSourceCache();

export default function CrudListDataGrid() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
    alert(`Person with id ${personId} deleted`);
  }, []);

  if (!isMounted) return null;

  return (
    <PageContainer>
      <List<Data>
        dataSource={dataSource}
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
              pagination: {
                paginationModel: {
                  pageSize: 10
                },
              },
              columns: {
                columnVisibilityModel: { id: false, vehicle: true, username: true, status: true },
              },
            },
          },
        }}
      />
    </PageContainer>
  );
}