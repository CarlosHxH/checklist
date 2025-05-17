'use client';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useRouter } from 'next/navigation';
import { Grid } from '@mui/material';


interface StyledTextProps {
  variant: 'primary' | 'secondary';
}

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyledTextProps>(({ theme }: any) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

const colors = [
  'hsl(220, 20%, 65%)',
  'hsl(220, 20%, 42%)',
  'hsl(220, 20%, 35%)',
  'hsl(220, 20%, 25%)',
];

type InspectionStatus = {
  id: string;
  label: string;
  value: number;
  count: number;
  percentage: number;
};
export default function ChartByVehicle() {
  const [data, setData] = React.useState<InspectionStatus[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch('/api/v2/dashboard/chart').then(e => e.json()).then(setData)
      } catch (error) {
        console.error('Error fetching inspection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const total = data.reduce((total: number, item: InspectionStatus) => total + item.count, 0);

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Inspeções por veiculos
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PieChart
            colors={colors}
            margin={{ left: 80, right: 80, top: 80, bottom: 80 }}
            series={[
              {
                data,
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 0,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
            onItemClick={(e, d) => router.push('/dashboard/inspection/' + data[d.dataIndex].id)}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel primaryText={`${total}` || "Erro ao carregar o total"} secondaryText="Total" />
          </PieChart>
        </Box>

        <Grid container gap={1} justifyContent={'center'}>
          {data.map((d, index) => (
            <Grid key={index} item xs={5}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 2, pb: 2 }}>
                <LocalShippingIcon />
                <Stack sx={{ gap: 1, flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>{d.label}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{d.value}</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    aria-label="Number count"
                    value={d.value}
                    sx={{
                      [`& .${linearProgressClasses.bar}`]: {
                        backgroundColor: "blue",
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}