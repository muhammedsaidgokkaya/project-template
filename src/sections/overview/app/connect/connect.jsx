import React, { useEffect, useState } from 'react';
import { CONFIG } from 'src/global-config';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function ConnectAppView() {
  const [metaAppId, setMetaAppId] = useState('');
  const [metaConnected, setMetaConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const redirectMetaUri = CONFIG.metaUrl;
  const metaScopes = [
    'ads_read',
    'ads_management',
    'business_management',
    'read_insights',
    'pages_manage_ads',
    'leads_retrieval',
  ].join(',');

  const [googleAppId, setGoogleAppId] = useState('');
  const redirectGoogleUri = CONFIG.googleUrl;
  const googleScopes = [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/analytics.manage.users.readonly',
    'https://www.googleapis.com/auth/webmasters',
  ].join(' ');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('Token bulunamadı!');
      return;
    }
  
    fetch(`${CONFIG.apiUrl}/MetaOauth/get-meta-app`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Veri alınırken hata oluştu.');
        }
        return response.json();
      })
      .then((data) => {
        setMetaAppId(data.appId);
      })
      .catch((error) => console.error('Meta App bilgisi alınamadı:', error));

    fetch(`${CONFIG.apiUrl}/GoogleOauth/get-google-app`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Veri alınırken hata oluştu.');
        }
        return response.json();
      })
      .then((data) => {
        setGoogleAppId(data.appId);
      })
      .catch((error) => console.error('Meta App bilgisi alınamadı:', error));

      const fetchData = async () => {
          
            const controlMetaUrl = `${CONFIG.apiUrl}/Auth/meta-token-control`;
            const tokenMetaControl = await fetch(controlMetaUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            const tokenMetaControlResult = await tokenMetaControl.json();
  
            const controlGoogleUrl = `${CONFIG.apiUrl}/Auth/google-token-control`;
            const tokenGoogleControl = await fetch(controlGoogleUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            const tokenGoogleControlResult = await tokenGoogleControl.json();
            setMetaConnected(tokenMetaControlResult === 1);
            setGoogleConnected(tokenGoogleControlResult === 1);
        };

      fetchData();
  }, []);

  const handleMetaConnect = () => {
    const oauthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${redirectMetaUri}&scope=${metaScopes}&response_type=token`;
    window.location.href = oauthUrl;
  };

  const handleGoogleConnect = () => {
    const oauthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${googleAppId}&redirect_uri=${redirectGoogleUri}&scope=${encodeURIComponent(
      googleScopes
    )}&access_type=offline`;
    window.location.href = oauthUrl;
  };
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
            <Button variant="contained" color="primary" onClick={handleMetaConnect} disabled={metaConnected}>
              {metaConnected ? 'Bağlantı Kuruldu' : 'Bağlan'}
            </Button>
          </Box>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Card sx={[{ p: 3 }]}>
          <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/apps/google.svg`} sx={{ width: 48, height: 48 }} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Google
          </Typography>
          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              typography: 'subtitle2',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" color="primary" onClick={handleGoogleConnect} disabled={googleConnected}>
              {googleConnected ? 'Bağlantı Kuruldu' : 'Bağlan'}
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
