import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

// Menu Popup State
export default function VerticalActions({ isMobile, params, handleEdit, handleView, handleDelete }:
  { isMobile?: boolean, params: GridRowParams, handleEdit?: (id: string) => void, handleView?: (id: string) => void, handleDelete?: (id: string) => void }) {
  const Filds = [
    handleEdit && <GridActionsCellItem key={1} icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.id as string)} />,
    handleView && <GridActionsCellItem key={2} icon={<ViewIcon />} label="View" onClick={() => handleView(params.id as string)} />,
    handleDelete && <GridActionsCellItem key={3} icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id as string)} color="error" />
  ]
  if (!isMobile) return (<>{Filds}</>)
  return (
    <PopupState variant="popover" popupId="popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton {...bindTrigger(popupState)} aria-haspopup="true" aria-label="more">
            <MoreVertIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            {Filds.filter(Boolean).map((item) => item && <MenuItem key={item.key} onClick={popupState.close}>{item}</MenuItem>)}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}