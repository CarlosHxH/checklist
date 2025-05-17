import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;