"use client"
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Página não encontrada
      </Typography>
      <Link href="/dashboard" passHref>
        <Button variant="contained" color="primary">
          Voltar para a Home
        </Button>
      </Link>
    </Box>
  );
};

export default UnauthorizedPage;