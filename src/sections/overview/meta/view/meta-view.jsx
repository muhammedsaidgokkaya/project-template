import React, { useEffect, useState, lazy, Suspense } from 'react';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import { CONFIG } from 'src/global-config';

import { DashboardContent } from 'src/layouts/dashboard';
import { MetaWidgetSummary } from '../meta-widget-summary';
import { MetaChartSliceCake } from '../meta-chart-slice-cake';
import { MetaYearly } from '../meta-yearly';

const CampaignsTab = lazy(() => import('./campaigns'));
const AdSetsTab = lazy(() => import('./adsets'));
const AdsTab = lazy(() => import('./ads'));

// ----------------------------------------------------------------------

export function MetaView() {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const getLast6Months = () => {
    const currentDate = new Date();
    const months = [
      'ocak',
      'şubat',
      'mart',
      'nisan',
      'mayıs',
      'haziran',
      'temmuz',
      'ağustos',
      'eylül',
      'ekim',
      'kasım',
      'aralık',
    ];
    const last6Months = [];

    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      last6Months.push(months[monthIndex]);
    }

    return last6Months.reverse();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    fetch(`${CONFIG.apiUrl}/Meta/charts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('API isteği sırasında hata oluştu:', error);
        setLoading(false);
      });

    if (loading || !apiData) return;

    const last6MonthsData = getLast6Months();
    const processedData = {
      spend: [],
      clicks: [],
      frequency: [],
      reach: [],
      impressions: [],
      categories: [],
    };

    last6MonthsData.forEach((month) => {
      const monthData = apiData[month]?.data?.[0];
      processedData.categories.push(month);
      if (monthData) {
        processedData.spend.push(parseFloat(monthData.spend || 0));
        processedData.clicks.push(parseInt(monthData.clicks || 0));
        processedData.frequency.push(parseFloat(monthData.frequency || 0));
        processedData.reach.push(parseInt(monthData.reach || 0));
        processedData.impressions.push(parseInt(monthData.impressions || 0));
      } else {
        processedData.spend.push(0);
        processedData.clicks.push(0);
        processedData.frequency.push(0);
        processedData.reach.push(0);
        processedData.impressions.push(0);
      }
    });

    setData(processedData);
  }, [apiData, loading]);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetaWidgetSummary
            title="Harcanan Tutar (TL)"
            percent={2.6}
            total={data?.spend.reduce((sum, value) => sum + value, 0) || 0}
            chart={{
              categories:
                data?.categories?.map((item) => capitalizeFirstLetter(item)) ||
                [],
              series: data?.spend || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MetaWidgetSummary
            title="Sıklık"
            percent={-0.1}
            total={
              data?.frequency.filter((value) => value !== 0).length > 0
                ? data?.frequency
                    .filter((value) => value !== 0)
                    .reduce((sum, value) => sum + value, 0) /
                  data?.frequency.filter((value) => value !== 0).length
                : 0
            }
            chart={{
              categories:
                data?.categories?.map((item) => capitalizeFirstLetter(item)) ||
                [],
              series: data?.frequency || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MetaWidgetSummary
            title="Tıklama"
            percent={0.6}
            total={data?.clicks.reduce((sum, value) => sum + value, 0) || 0}
            chart={{
              categories:
                data?.categories?.map((item) => capitalizeFirstLetter(item)) ||
                [],
              series: data?.clicks || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <MetaChartSliceCake
            title="Son 4 ay Erişim"
            chart={{
              series:
                data?.reach?.slice(-4).map((reach, index) => ({
                  label: capitalizeFirstLetter(
                    data?.categories?.slice(-4)[index] || ''
                  ),
                  value: reach,
                })) || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <MetaYearly
            title="Gösterim"
            subheader="Son 6 ay"
            chart={{
              categories:
                data?.categories?.map((item) => capitalizeFirstLetter(item)) ||
                [],
              series: [
                {
                  name: 'Gösterim',
                  data:
                    data?.impressions?.map((impression) =>
                      new Intl.NumberFormat('tr-TR').format(impression)
                    ) || [],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable">
            <Tab label="Kampanyalar" />
            <Tab label="Reklam Setleri" />
            <Tab label="Reklamlar" />
          </Tabs>
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }} >
          <Suspense fallback={<div>Yükleniyor...</div>}>
            {currentTab === 0 && <CampaignsTab />}
            {currentTab === 1 && <AdSetsTab />}
            {currentTab === 2 && <AdsTab />}
          </Suspense>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
