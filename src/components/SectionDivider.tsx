import { Divider, Grid } from "@mui/material";

const SectionDivider: React.FC<{ title: string }> = ({ title }) => (
    <Grid item xs={12} mb={-3}><Divider>{title}</Divider></Grid>
);
export default SectionDivider