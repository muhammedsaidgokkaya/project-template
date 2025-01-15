import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import { Chart, useChart } from 'src/components/chart';
import { CONFIG } from 'src/global-config';

export function AnalyticsWebsiteVisits({ title, subheader, selectedAccount, dimension, metric, seriesName, startDate, endDate, sx, ...other }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({ series: [], labels: [] });

  useEffect(() => {
    const fetchChartData = async (start, end) => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CONFIG.apiUrl}/Analytics/dashboard-dimensions-ten?accountId=${selectedAccount}&dimension=${dimension}&metric=${metric}&startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const chartSeries = [{
          name: seriesName,
          data: data.map((item) => item.metric),
        }];
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

  const chartSeries = chartData.series;
  const chartCategories = chartData.labels;

  const chartColors = chartData.colors ?? [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.warning.main, 0.8),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    xaxis: { categories: chartCategories },
    legend: { show: true },
    tooltip: { y: { formatter: (value) => `${value}` } },
    ...chartData.options,
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={chartSeries}
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 405,
        }}
      />
    </Card>
  );
}
