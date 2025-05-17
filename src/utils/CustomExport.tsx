import * as React from 'react';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridCsvExportOptions,
  GridExportMenuItemProps,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridApi,
} from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import { ButtonProps } from '@mui/material/Button';
import { formatDate } from '.';


const getJson = (apiRef: React.RefObject<GridApi>) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row: Record<string, any> = {};
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  // Stringify with some indentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  return JSON.stringify(data, null, 2);
};

const exportBlob = (blob: Blob, filename: string) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};


function JsonExportMenuItem(props: GridExportMenuItemProps<Record<string, never>>) {
  const apiRef = useGridApiContext();
    
  const { hideMenu } = props;
  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(apiRef);
        const blob = new Blob([jsonString], {
          type: 'text/json',
        });
        exportBlob(blob, `export_${formatDate(new Date(), 'yyyy-MM-dd_HHmmss')}.json`);
        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      Export JSON
    </MenuItem>
  );
}

const csvOptions: GridCsvExportOptions = { delimiter: ';',fileName: `export_${formatDate(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`};

export function CustomExportButton(props: ButtonProps) {
  return (
    <GridToolbarExportContainer {...props}>
      <GridCsvExportMenuItem options={csvOptions} />
      <JsonExportMenuItem />
    </GridToolbarExportContainer>
  );
}

export function CustomToolbar(props: GridToolbarContainerProps) {
  return (
    <GridToolbarContainer {...props}>
      <CustomExportButton />
    </GridToolbarContainer>
  );
}
