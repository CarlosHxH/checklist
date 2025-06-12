"use client"
import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, IconButton, Collapse, Stack, CardHeader, styled } from '@mui/material';
import { DirectionsCar as CarIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InspectionData, InspectionDetail } from '@/types/inspectionType';
import { formatDate } from '@/utils';

interface CardViagemProps {
  inspection: InspectionData;
}


// Styled expand icon to rotate when expanded
const ExpandMore = styled((props: { expanded: boolean } & React.ComponentProps<typeof IconButton>) => {
  const { expanded, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expanded }) => ({
  transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const CardViagem = ({ inspection }: CardViagemProps) => {
  const [expanded, setExpanded] = React.useState(false);

  const getStatusColor = (status: string | undefined) => {
    if (status === 'INICIO') return 'primary';
    if (status === 'FINAL') return 'success';
    return 'error';
  };

  const format = (date: string) => {
    return formatDate(new Date(date), 'dd/MM/yyyy HH:mm');
  };

  const renderInspectionDetails = (detail: InspectionDetail | null, type: 'start' | 'end') => {
    if (!detail) return null;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {type === 'start' ? 'Inspeção Inicial' : 'Inspeção Final'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Quilometragem:</strong> {detail.kilometer}
            </Typography>
            <Typography variant="body2">
              <strong>CRLV em dia:</strong> {detail.crlvEmDia}
            </Typography>
            <Typography variant="body2">
              <strong>Nível de Água:</strong> {detail.nivelAgua}
            </Typography>
            <Typography variant="body2">
              <strong>Nível de Óleo:</strong> {detail.nivelOleo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Estado dos Pneus:</strong>
            </Typography>
            <Typography variant="body2">
              - Dianteira: {detail.dianteira}
            </Typography>
            <Typography variant="body2">
              - Tração: {detail.tracao}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 2, bgcolor: 'rgba(0,0,0,.0)' }}>
      <CardHeader
        title={`${inspection.vehicle.make} ${inspection.vehicle.model}`}
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>
              <CarIcon />
              {`Placa: ${inspection.vehicle.plate} | Viagem: ${format(inspection.createdAt)} `}
            </Typography>
          </Box>
        }
        action={
          <ExpandMore expanded={expanded} onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-label="mostre mais">
            <ExpandMoreIcon />
          </ExpandMore>
        }
      />
      <CardContent>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Veiculo: {inspection.vehicle?.plate + " - " + inspection.vehicle?.model}
          </Typography>
          <Grid item xs={12} direction={'column'} sx={{ display: "flex", justifyContent: "flex-end", gap: 1, }}>
            {inspection.start?.isFinished ? (
              <Chip label="Início" color={getStatusColor('INICIO')} size="small" icon={<CheckCircleIcon />} />
            ) : (
              <Link href={`/viagem/inicio/${inspection.id}`}>
                <Chip label="Iniciar" color={getStatusColor('')} size="small" icon={<ErrorOutlineIcon />} />
              </Link>
            )}

            {!inspection.start?.isFinished ?
              (<></>)
              : inspection.end ? (
                <Chip label="Final" color={getStatusColor('FINAL')} size="small" icon={<CheckCircleIcon />} />
              ) : (
                <Link href={`/viagem/final/${inspection.id}`}>
                  <Chip label="Clique para finalizar" color={getStatusColor('')} size="small" icon={<ErrorOutlineIcon />} />
                </Link>
              )}
          </Grid>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {renderInspectionDetails(inspection.start, 'start')}
          {renderInspectionDetails(inspection.end, 'end')}
        </Collapse>
      </CardContent>
    </Card>
  );
};




// Componente principal
const CardViagemList = ({ data }: { data?: InspectionData[] }) => {
  if(!data) return <Box p={2}>Nenhuma viagem encontrada.</Box>;
  return (
    <Box sx={{ py: 1 }}>
      {data.length > 0 && data.map((data) => (<CardViagem key={data.id} inspection={data} />))}
    </Box>
  );
};

export default CardViagemList;