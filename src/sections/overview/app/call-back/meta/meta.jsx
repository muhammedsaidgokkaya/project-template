import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from 'src/global-config';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function MetaCallAppView() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get('access_token');
    const data_access_expiration_time = urlParams.get('data_access_expiration_time');
    const expires_in = urlParams.get('expires_in');

    if (!access_token || !data_access_expiration_time || !expires_in) {
    }

    const fetchAccessToken = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(
          `${CONFIG.apiUrl}/MetaOauth/call-back?access_token=${access_token}&data_access_expiration_time=${data_access_expiration_time}&expires_in=${expires_in}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
        }

        const data = await response.json();

        if (data.isSuccess) {
        } else {
        }
      } catch (error) {
      }
    };

    fetchAccessToken();
  }, [navigate]);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Meta Bağlantısı Yapılıyor...</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
