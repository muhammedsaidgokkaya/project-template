import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from 'src/global-config';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export function GoogleCallAppView() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const scope = urlParams.get('scope');

    if (!code || !scope) {
      navigate('/connect');
    }

    const fetchAccessToken = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(
          `${CONFIG.apiUrl}/GoogleOauth/call-back?code=${code}&scope=${scope}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          navigate('/connect');
        }

        const data = await response.json();

        if (data.isSuccess) {
          navigate('/connect');
        } else {
          navigate('/connect');
        }
      } catch (error) {
        navigate('/connect');
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
              <Typography variant="h6">Google Bağlantısı Yapılıyor...</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}