import React, { useEffect, useState, lazy, Suspense } from 'react';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
  const [metaAccounts, setMetaAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');

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
    fetch(`${CONFIG.apiUrl}/Meta/meta-account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMetaAccounts(data);
        setSelectedAccountId(data[0].accountId);
      })
      .catch((error) => {
        console.error('API isteği sırasında hata oluştu:', error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (selectedAccountId) {
      fetch(`${CONFIG.apiUrl}/Meta/charts?accountId=${selectedAccountId}`, {
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
    }
  }, [selectedAccountId]);

  useEffect(() => {
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

        <Grid size={{ xs: 12, lg: 6 }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable">
            <Tab label="Kampanyalar" />
            <Tab label="Reklam Setleri" />
            <Tab label="Reklamlar" />
          </Tabs>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          
        </Grid>
        
        <Grid size={{ xs: 12, lg: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Reklam Hesapları</InputLabel>
            <Select
              value={selectedAccountId}
              onChange={(event) => setSelectedAccountId(event.target.value)}
              label="Reklam Hesapları"
            >
              {metaAccounts.map((account) => (
                <MenuItem key={account.accountId} value={account.accountId}>
                  {account.account}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }} >
          <Suspense fallback={<div>Yükleniyor...</div>}>
            {currentTab === 0 && selectedAccountId && <CampaignsTab selectedAccountId={selectedAccountId} key={selectedAccountId} />}
            {currentTab === 1 && selectedAccountId && <AdSetsTab selectedAccountId={selectedAccountId} key={selectedAccountId}/>}
            {currentTab === 2 && selectedAccountId && <AdsTab selectedAccountId={selectedAccountId} key={selectedAccountId}/>}
          </Suspense>
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
