import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import { Chart, useChart } from 'src/components/chart';
import { CONFIG } from 'src/global-config';

export function DataWebsiteVisits({ title, subheader, dimension, metric, seriesName, startDate, endDate, sx, ...other }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({ series: [], labels: [] });

  useEffect(() => {
    const fetchChartData = async (start, end) => {
      try {
        const token = localStorage.getItem('jwtToken');
        const url = `${CONFIG.apiUrl}/SearchConsole/get-search-console-chart-ten?dimensions=${dimension}&startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
        });
    
        const data = await response.json();
        if (metric) {
            const chartSeries = [{
              name: seriesName,
              data: data.map((item) => item.clicks),
            }];
            const chartLabels = data.map((item) => item.keys);
    
            setChartData({
              series: chartSeries,
              labels: chartLabels,
            });
          } else {
              const chartSeries = [{
                  name: seriesName,
                  data: data.map((item) => item.impressions),
              }];
              const chartLabels = data.map((item) => item.keys);
      
              setChartData({
                  series: chartSeries,
                  labels: chartLabels,
              });
          }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchChartData(startDate, endDate);
  }, [dimension, metric, startDate, endDate]);

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
          height: 430,
        }}
      />
    </Card>
  );
}
