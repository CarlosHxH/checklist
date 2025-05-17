"use client"
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import useSWR from "swr";
import { fetcher } from "@/lib/ultils";
import Loading from "@/components/Loading";

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

type InspectionData = {
  id: string;
  label: string;
  data: number[];
  stack: string;
};

export default function PageViewsBarChart() {
  const theme = useTheme();
  const { data: apiData, isLoading } = useSWR<InspectionData[]>("/api/v2/dashboard/chart",fetcher);

  if (isLoading || !apiData?.length) return <Loading />;
  console.log(apiData);

  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Page views and downloads
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              1.3M
            </Typography>
            <Chip size="small" color="error" label="-8%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Page views and downloads for the last 6 months
          </Typography>
        </Stack>
        {apiData && apiData.length > 0 && (
          <BarChart
            borderRadius={8}
            colors={colorPalette}
            xAxis={[
              {
                scaleType: "band",
                data: MONTHS,
              },
            ]}
            series={apiData}
            height={250}
            margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
