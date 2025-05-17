import { Paper, TextField } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBar({ value, onChange }: any) {
  return (
    <Paper sx={{ display: "flex", justifyContent: "end", gap: 2, p: 2 }}>
      <TextField name="filter" label="Filtrar" value={value} onChange={onChange} size="small" InputProps={{
          startAdornment: (<SearchIcon sx={{ color: "action.active", mr: 1 }} />)
        }} />
    </Paper>
  )
}