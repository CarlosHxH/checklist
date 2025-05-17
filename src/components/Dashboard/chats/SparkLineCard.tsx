// components/SparkLineCard.tsx
import { Card, CardContent, Typography, Box } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts';
import useSWR from 'swr';

interface DailyOccurrence {
    day: number;
    count: number;
}

interface SparkLineCardProps {
    title: string;
    subtitle?: string;
    year: number;
    month: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SparkLineCard({ title, subtitle, year, month }: SparkLineCardProps) {
    const { data, error, isLoading } = useSWR<DailyOccurrence[]>(`/api/v2/dashboard/occurrence`,fetcher);
    

    if (error) {
        return (
            <Card sx={{ minWidth: 275, height: 150 }}>
                <CardContent>
                    <Typography color="error">Erro ao carregar dados</Typography>
                </CardContent>
            </Card>
        );
    }

    if (isLoading || !data) {
        return (
            <Card sx={{ minWidth: 275, height: 150 }}>
                <CardContent>
                    <Typography>Carregando...</Typography>
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map(item => item.count);
    const total = chartData.reduce((acc, curr) => acc + curr, 0);
    const average = (total / chartData.length).toFixed(1);

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <SparkLineChart
                    data={chartData}
                    height={100}
                    showTooltip
                    showHighlight
                    curve="linear"
                    sx={{'& .MuiChartsSparkLine-root': {strokeWidth: 2}}}
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total: {total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Média: {average}/dia
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}