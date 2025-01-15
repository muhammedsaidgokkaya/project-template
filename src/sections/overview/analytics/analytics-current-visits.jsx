import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { CONFIG } from 'src/global-config';
import { fNumber } from 'src/utils/format-number';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

export function AnalyticsCurrentVisits({ title, subheader, selectedAccount, dimension, metric, startDate, endDate, sx, ...other }) {
  const [chartData, setChartData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchChartData = async (start, end) => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CONFIG.apiUrl}/Analytics/dashboard-dimensions-four?accountId=${selectedAccount}&dimension=${dimension}&metric=${metric}&startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const chartSeries = data.map((item) => item.metric);
        const chartLabels = data.map((item) => item.dimension);

        setChartData({
          series: chartSeries,
          labels: chartLabels,
        });
      } catch (error) {
      }
    };
    
    if (selectedAccount) {
      fetchChartData(startDate, endDate);
    }
  }, [selectedAccount, dimension, metric, startDate, endDate]);

  const chartColors = chartData?.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.light,
    theme.palette.info.dark,
    theme.palette.error.main,
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