"use client"
import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Crud, DataSourceCache } from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';
import { dataSource, Note } from './actions';

export default function CrudBasic() {
  const notesCache = new DataSourceCache();
  const router = useDemoRouter('/issues');
  return (
    <AppProvider router={router}>
      <Crud<Note>
        dataSource={dataSource}
        dataSourceCache={notesCache}
        rootPath="/issues"
        initialPageSize={10}
        defaultValues={{ text: 'Oredem de serviços' }}
      />
    </AppProvider>
  );
}
