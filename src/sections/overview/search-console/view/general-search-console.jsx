import React from 'react';
import Grid from '@mui/material/Grid2';

import { DataConversionRates } from '../data-conversion';
import { DataCurrent } from '../data-current';
import { DataCurrentVisits } from '../data-current-visits';
import { DataWebsiteVisits } from '../data-website';

// ----------------------------------------------------------------------

export default function GeneralSearchConsole({ startDate, endDate }) {
  return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <DataWebsiteVisits
            title="Tarih"
            subheader="Gösterim"
            dimension="date"
            metric={false}
            seriesName="Gösterim"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DataCurrentVisits
            title="Cihazlar"
            subheader="Gösterim"
            dimension="device"
            metric={false}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DataCurrent
            title="Cihazlar"
            subheader="Tıklama"
            dimension="device"
            metric={true}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <DataWebsiteVisits
            title="Ülke"
            subheader="Tıklama"
            dimension="country"
            metric={true}
            seriesName="Tıklama"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <DataConversionRates
            title="Ülkeler"
            subheader="Gösterim"
            dimensions="country"
            metric={false}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <DataConversionRates
            title="Sorgular"
            subheader="Tıklama"
            dimensions="query"
            metric={true}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

      </Grid>
  );
}
