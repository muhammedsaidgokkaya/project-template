import React, { useEffect, useState } from 'react';
import { CONFIG } from 'src/global-config';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function AccountAppView() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        
        <Card sx={[{ p: 3 }]}>
          <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/apps/meta.svg`} sx={{ width: 48, height: 48 }} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Meta
          </Typography>
          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              typography: 'subtitle2',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" color="primary">
              Bağlan
            </Button>
          </Box>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
      </Grid>
    </Grid>
  );
}
