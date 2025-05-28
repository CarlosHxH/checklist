"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD } from '@mui/x-data-grid/internals';

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

export default function DataGridPremiumDemo() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
    visibleFields,
  });
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        ...data.initialState?.rowGrouping,
        model: ['commodity'],
      },
      sorting: {
        sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'asc' }],
      },
      aggregation: {
        model: {
          quantity: 'sum',
        },
      },
    },
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        {...data}
        columns={data.columns.map(({ generateData, dataGeneratorUniquenessEnabled, hide, ...col }) => col) as import('@mui/x-data-grid').GridColDef[]}
        apiRef={apiRef}
        loading={loading}
        disableRowSelectionOnClick
        initialState={initialState}
      />
    </Box>
  );
}

export function useKeepGroupedColumnsHidden({ apiRef, initialState }: { apiRef: any; initialState: any }) {
  // Ensure the grouped column is hidden in the initial state
  const hiddenFields = new Set(initialState?.columns?.columnVisibilityModel ? Object.keys(initialState.columns.columnVisibilityModel) : []);
  hiddenFields.add(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD);

  return {
    ...initialState,
    columns: {
      ...initialState?.columns,
      columnVisibilityModel: {
        ...initialState?.columns?.columnVisibilityModel,
        [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD]: false,
      },
    },
  };
}
