"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const visibleFields = [
  'commodity',
  'quantity',
  'filledQuantity',
  'status',
  'isFilled',
  'unitPrice',
  'unitPriceCurrency',
  'subTotal',
  'feeRate',
  'feeAmount',
  'incoTerm',
];

export default function DataGridDemo() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
    visibleFields,
  });
  
  const apiRef = useGridApiRef();

  const initialState = {
    ...data.initialState,
    sorting: {
      sortModel: [{ field: 'commodity', sort: 'asc' }],
    },
  };

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        {...data}
        apiRef={apiRef}
        loading={loading}
        disableRowSelectionOnClick
        initialState={initialState}
        slots={{
          toolbar: () => null, // Toolbar is available in standard DataGrid
        }}
      />
    </Box>
  );
}