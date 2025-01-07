import React, { useState, useEffect, lazy, Suspense } from 'react';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'

import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/global-config';

const GeneralAnalytics = lazy(() => import('./general-analytics'));
const DetailAnalytics = lazy(() => import('./detail-analytics'));

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [currentTab, setCurrentTab] = useState(0);
  const [dashboardData, setDashboardData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(120, 'days'));
  const [endDate, setEndDate] = useState(dayjs());

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const fetchDashboardData = async (start, end) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.apiUrl}/Analytics/dashboards?startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard verisi alınırken bir hata oluştu', error);
    }
  };

  useEffect(() => {
    fetchDashboardData(startDate, endDate);
  }, [startDate, endDate]);

  const prepareChartData = (data) => {
    const categories = data.map(item => dayjs(item.month).locale('tr').format('MMMM'));
    
    const series = {
      activeUsers: data.map(item => item.data[0].activeUsers),
      eventCount: data.map(item => item.data[0].eventCount),
      newUsers: data.map(item => item.data[0].newUsers),
      engagedSessions: data.map(item => item.data[0].engagedSessions),
    };
  
    return { categories, series };
  };

  const { categories, series } = prepareChartData(dashboardData);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Aktif Kullanıcılar"
            percent={series.activeUsers ? series.activeUsers[0] : 0}
            total={series.activeUsers.reduce((a, b) => a + b, 0)}
            icon={
              <img
                alt="Aktif Kullanıcılar"
                src={`${CONFIG.assetsDir}/assets/icons/glass/active.svg`}
              />
            }
            chart={{
              categories: categories,
              series: series.activeUsers,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Yeni Kullanıcılar"
            percent={series.newUsers ? series.newUsers[0] : 0}
            total={series.newUsers.reduce((a, b) => a + b, 0)}
            color="secondary"
            icon={
              <img
                alt="Yeni Kullanıcılar"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{
              categories: categories,
              series: series.newUsers,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Olaylar"
            percent={series.eventCount ? series.eventCount[0] : 0}
            total={series.eventCount.reduce((a, b) => a + b, 0)}
            color="warning"
            icon={
              <img
                alt="Olaylar"
                src={`${CONFIG.assetsDir}/assets/icons/glass/event.svg`}
              />
            }
            chart={{
              categories: categories,
              series: series.eventCount,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Etkileşimli Oturum"
            percent={series.engagedSessions ? series.engagedSessions[0] : 0}
            total={series.engagedSessions.reduce((a, b) => a + b, 0)}
            color="error"
            icon={
              <img
                alt="Etkileşimli Oturum"
                src={`${CONFIG.assetsDir}/assets/icons/glass/session.svg`}
              />
            }
            chart={{
              categories: categories,
              series: series.engagedSessions,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable">
            <Tab label="Genel" />
            <Tab label="Detay" />
          </Tabs>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          {/* Buraya tarih aralığı seçimi gibi başka içerikler ekleyebilirsiniz */}
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              pr: { xs: 2.5, md: 1 },
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-end', md: 'center' },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <DatePicker
                label="Başlangıç Tarihi"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{ maxWidth: { md: 180 } }}
              />
              <DatePicker
                label="Bitiş Tarihi"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                sx={{
                  maxWidth: { md: 180 },
                  [`& .MuiFormHelperText-root`]: {
                    bottom: { md: -40 },
                    position: { md: 'absolute' },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 12 }}>
          <Suspense fallback={<div>Yükleniyor...</div>}>
            {currentTab === 0 && <GeneralAnalytics startDate={startDate} endDate={endDate} />}
            {currentTab === 1 && <DetailAnalytics startDate={startDate} endDate={endDate}/>}
          </Suspense>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
