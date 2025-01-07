import React from 'react';
import Grid from '@mui/material/Grid2';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AppCurrentDownload } from '../analytics-current-total';

// ----------------------------------------------------------------------

export default function GeneralAnalytics({ startDate, endDate }) {
  return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Oturumlar (Kıta Bazında)"
            dimension="continent"
            metric="sessions"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Oturumlar"
            subheader="Ülke Bazında"
            dimension="country"
            metric="sessions"
            seriesName="Oturum"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Görüntüleme, Sayfa Başlığı ve Ekran Sınıfı"
            dimension="unifiedScreenClass"
            metric="screenPageViews"
            seriesName="Görüntüleme"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Oturum, Sayfa Başlığı"
            dimension="pageTitle"
            metric="sessions"
            seriesName="Oturum"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Oturum, Açılış Sayfası"
            dimension="landingPage"
            metric="sessions"
            seriesName="Oturum"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <AppCurrentDownload
            title="Oturumlar (Cihaz Kategorisi)"
            dimension="browser"
            metric="sessions"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <AnalyticsCurrentVisits
            title="Oturumlar (Dil Bazında)"
            dimension="language"
            metric="sessions"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Aktif Kullanıcı, Şehir"
            dimension="city"
            metric="activeUsers"
            seriesName="Aktif Kullanıcı"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Oturum, Varsayılan Kanal Grup"
            dimension="sessionDefaultChannelGroup"
            metric="sessions"
            seriesName="Oturum"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Etkinlik Sayısı, Etkinlik Adı"
            dimension="eventName"
            metric="eventCount"
            seriesName="Etkinlik Sayısı"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
      </Grid>
  );
}
