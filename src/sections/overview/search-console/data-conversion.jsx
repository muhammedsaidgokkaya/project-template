import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { CONFIG } from 'src/global-config';

import { fNumber } from 'src/utils/format-number';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function DataConversionRates({ title, subheader, dimensions, startDate, endDate, sx, ...other }) {
  const theme = useTheme();

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CONFIG.apiUrl}/SearchConsole/get-search-console-chart-ten?dimensions=${dimensions}&startDate=${startDate}&endDate=${endDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();

        const clicksData = data.map((row) => row.clicks);
        const categories = data.map((row) => row.keys);
        setChartData({
          categories,
          series: [
            { name: 'Tıklama', data: clicksData },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [dimensions, startDate, endDate]);

  const chartColors = chartData
    ? [
        theme.palette.primary.dark,
        hexAlpha(theme.palette.primary.dark, 0.24),
      ]
    : [];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: chartData?.categories || [] },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: { fontSize: '10px', colors: ['#FFFFFF', theme.palette.text.primary] },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: '48%',
        dataLabels: { position: 'top' },
      },
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      {chartData ? (
        <Chart
          type="bar"
          series={chartData.series}
          options={chartOptions}
          slotProps={{ loading: { p: 2.5 } }}
          sx={{
            pl: 1,
            py: 2.5,
            pr: 2.5,
            height: 360,
          }}
        />
      ) : (
        <p style={{ padding: '16px', textAlign: 'center' }}>Yükleniyor...</p>
      )}
    </Card>
  );
}
