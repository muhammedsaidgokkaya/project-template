import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { CONFIG } from 'src/global-config';
import { fNumber } from 'src/utils/format-number';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function DataCurrentVisits({ title, subheader, selectedAccount, dimension, metric, startDate, endDate, sx, ...other }) {
  const [chartData, setChartData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchChartData = async (start, end) => {
      try {
        const token = localStorage.getItem('jwtToken');
        const url = `${CONFIG.apiUrl}/SearchConsole/get-search-console-chart-four?accountId=${selectedAccount}&dimensions=${dimension}&startDate=${start}&endDate=${end}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (metric) {
          const chartSeries = data.map((row) => row.clicks);
          const chartLabels = data.map((row) => row.keys);
          setChartData({
            series: chartSeries,
            labels: chartLabels,
          });
        } else {
          const chartSeries = data.map((row) => row.impressions);
          const chartLabels = data.map((row) => row.keys);
          setChartData({
            series: chartSeries,
            labels: chartLabels,
          });
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    if (selectedAccount) {
      fetchChartData(startDate, endDate);
    }
  }, [selectedAccount, dimension, metric, startDate, endDate]);

  const chartColors = chartData?.colors ?? [
    theme.palette.primary.lighter,
    theme.palette.primary.light,
    theme.palette.primary.dark,
    theme.palette.primary.darker,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chartData?.labels || [],
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Chart
        type="pie"
        series={chartData?.series || []}
        options={chartOptions}
        sx={{
          my: 6,
          mx: 'auto',
          width: { xs: 240, xl: 260 },
          height: { xs: 240, xl: 260 },
        }}
      />
      <Divider sx={{ borderStyle: 'dashed' }} />
      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}