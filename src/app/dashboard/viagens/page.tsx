import { Box, Typography } from "@mui/material";
import CollapsibleTable from "./CollapsedTable";

export default function InspecoesPage() {
  return (
    <Box p={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        Inspeções de Viagens
      </Typography>
      <CollapsibleTable />
    </Box>
  );
}