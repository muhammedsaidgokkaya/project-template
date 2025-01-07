import React from 'react';
import Grid from '@mui/material/Grid2';

import { DataActivity } from '../data-activity';
import { DataConversionRates } from '../data-conversion';
import { DataCurrent } from '../data-current';
import { DataCurrentVisits } from '../data-current-visits';

// ----------------------------------------------------------------------

export default function GeneralSearchConsole({ startDate, endDate }) {
  return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          {/* <DataActivity
            title="Tarih"
            subheader="Gösterim"
            dimensions="date"
          /> */}
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DataCurrentVisits
            title="Cihazlar"
            subheader="Gösterim"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DataCurrent
            title="Cihazlar"
            subheader="Tıklama"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          {/* <DataActivity
            title="Sorgular"
            subheader="Gösterim"
            dimensions="query"
          /> */}
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <DataConversionRates
            title="Ülkeler"
            subheader="Tıklama"
            dimensions="country"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <DataConversionRates
            title="Sorgular"
            subheader="Tıklama"
            dimensions="query"
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>

      </Grid>
  );
}
