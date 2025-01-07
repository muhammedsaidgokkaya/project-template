import React, { useState, useEffect } from 'react';
import { CONFIG } from 'src/global-config';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fData } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect } from 'src/components/chart';

// ----------------------------------------------------------------------

export function DataActivity({ title, subheader, dimensions, sx, ...other }) {
  const theme = useTheme();

  const [chartData, setChartData] = useState(null);

  const fetchChartData = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`${CONFIG.apiUrl}/SearchConsole/get-search-console-chart-apex-ten?dimensions=${dimensions}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.series && data.series.length > 0) {
        setChartData({
          series: data.series,
          categories: data.series[0]?.categories || [],
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (!chartData) {
    return <div></div>;
  }

  const dataSeries = chartData.series.map(series => ({
    name: series.name,
    data: series.data,
  }));

  const chartColors = theme.palette.error.main ? [
    theme.palette.error.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    hexAlpha(theme.palette.grey[500], 0.48),
  ] : [];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    legend: { show: true },
    xaxis: { categories: chartData.categories },
    tooltip: { y: { formatter: (value) => `${value}` } },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
      />

      <Chart
        type="bar"
        series={dataSeries}
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
