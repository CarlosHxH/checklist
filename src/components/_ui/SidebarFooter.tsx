import { Box, Typography } from "@mui/material";

export default function SidebarFooter() {
    return (
      <Box sx={{ mt: 'auto', textAlign: 'left' }}>
        <Typography variant="caption" sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {`© 2025 Made with love by CarlosHxH`}
        </Typography>
      </Box>
    );
  }