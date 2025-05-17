"use client"
import { Box, Container } from '@mui/material';
import CustomFab from '@/components/_ui/CustomFab';
import useSWR from 'swr';
import { fetcher } from '@/lib/ultils';
import { Suspense, useMemo } from 'react';
import Loading from '@/components/Loading';
import CardViagemList from './CardViagemList';


export default function Viagens({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/v1/viagens/user/${id}` : null,
    fetcher, {
    //refreshInterval: 10000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })

  const showCustomFab = useMemo(() => !data || data.length === 0 || Boolean(data[0]?.end), [data]);

  if (isLoading) return <Loading />;
  if (error) return <Box>Erro ao carregar dados. Por favor, tente novamente.</Box>;

  return (
    <Suspense fallback={<Loading />}>
      <Container maxWidth="lg">
        {showCustomFab && <CustomFab href="/viagem/inicio/create" variant="Plus" />}
        <CardViagemList data={data} />
      </Container>
    </Suspense>
  );
}