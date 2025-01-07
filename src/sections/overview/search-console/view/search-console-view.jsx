import React, { useState, useEffect, lazy, Suspense } from 'react';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'

import { CONFIG } from 'src/global-config';

import { DashboardContent } from 'src/layouts/dashboard';
import { _bookings, _bookingNew, _bookingReview, _bookingsOverview } from 'src/_mock';

const GeneralSearchConsole = lazy(() => import('./general-search-console'));
const DetailSearchConsole = lazy(() => import('./detail-search-console'));

import { SearchConsoleWidgetSummary } from '../search-console-widget-summary';

// ----------------------------------------------------------------------

export function OverviewSearchConsoleView() {
  const [currentTab, setCurrentTab] = useState(0);
  const [dashboardData, setDashboardData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(120, 'days'));
  const [endDate, setEndDate] = useState(dayjs());
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CONFIG.apiUrl}/SearchConsole/get-search-console`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setDashboardData(data[0]);
      } catch (error) {
        console.error('Dashboard verisi alınırken bir hata oluştu', error);
      }
    };
  
    useEffect(() => {
      fetchDashboardData();
    }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <SearchConsoleWidgetSummary
            title="Toplam Tıklama Sayısı"
            percent={2.6}
            total={dashboardData.totalClicks}
            icon={
                <img
                    alt="Aktif Kullanıcılar"
                    src={`${CONFIG.assetsDir}/assets/icons/glass/clicks.svg`}
                />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SearchConsoleWidgetSummary
            title="Toplam Gösterim Sayısı"
            percent={0.2}
            total={dashboardData.totalImpressions}
            icon={
                <img
                    alt="Aktif Kullanıcılar"
                    src={`${CONFIG.assetsDir}/assets/icons/glass/impression.svg`}
                />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SearchConsoleWidgetSummary
            title="Ortalama Tıklama Oranı (TO)"
            percent={-0.1}
            total={dashboardData.averageCtr}
            icon={
                <img
                    alt="Aktif Kullanıcılar"
                    src={`${CONFIG.assetsDir}/assets/icons/glass/percentage.svg`}
                />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
            <SearchConsoleWidgetSummary
                title="Ortalama Konum"
                percent={-0.1}
                total={dashboardData.averagePosition}
                icon={
                    <img
                        alt="Aktif Kullanıcılar"
                        src={`${CONFIG.assetsDir}/assets/icons/glass/position.svg`}
                    />
                }
            />
        </Grid>

        
        <Grid size={{ xs: 12, lg: 6 }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable">
            <Tab label="Genel" />
            <Tab label="Detay" />
          </Tabs>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
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
            {currentTab === 0 && <GeneralSearchConsole startDate={startDate} endDate={endDate} />}
            {currentTab === 1 && <DetailSearchConsole startDate={startDate} endDate={endDate}/>}
          </Suspense>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
