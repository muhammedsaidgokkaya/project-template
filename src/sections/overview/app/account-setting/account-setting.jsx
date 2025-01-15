import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from 'src/global-config';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { toast } from 'src/components/snackbar';

const fetchData = async (url, token) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`${url} API response was not ok`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
};

const SelectWithCheckbox = ({ label, items, selectedItems, onChange, renderValueKey }) => (
  <FormControl fullWidth variant="outlined">
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      value={selectedItems}
      onChange={onChange}
      label={label}
      renderValue={(selected) =>
        selected.map((item) => item[renderValueKey]).join(', ')
      }
    >
      {items.map((item) => (
        <MenuItem key={item.id || item.name || item.siteUrl} value={item}>
          <Checkbox checked={selectedItems.includes(item)} />
          <ListItemText primary={item[renderValueKey]} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export function AccountAppView() {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [analyticsAccounts, setAnalyticsAccounts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [advertisingAccounts, setAdvertisingAccounts] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedAnalytics, setSelectedAnalytics] = useState([]);
  const [selectedAdvertisingAccount, setSelectedAdvertisingAccount] = useState([]);
  const [accountCount, setAccountCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    const fetchInitialData = async () => {
      const [siteData, analyticsData, businessData, accountCountData] = await Promise.all([
        fetchData(`${CONFIG.apiUrl}/SearchConsole/get-sites`, token),
        fetchData(`${CONFIG.apiUrl}/Analytics/account-summarys`, token),
        fetchData(`${CONFIG.apiUrl}/meta/business`, token),
        fetchData(`${CONFIG.apiUrl}/Organization/account-count`, token),
      ]);

      const controlUrl = `${CONFIG.apiUrl}/Auth/organization-control`;
      const tokenControl = await fetch(controlUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const tokenControlResult = await tokenControl.json();

      if (tokenControlResult === 1) {
        navigate('/dashboard');
      }
      
      setSites(siteData?.[0]?.siteEntry || []);
      setAnalyticsAccounts(analyticsData?.[0]?.accountSummaries || []);
      setBusinesses(businessData?.[0]?.data || []);
      setAccountCount(accountCountData?.accountCounts || 0);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      const businessIds = businesses.map((business) => business.id);
      const token = localStorage.getItem('jwtToken');

      fetchData(
        `${CONFIG.apiUrl}/meta/advertising-accounts?businessIds=${businessIds.join(',')}`,
        token
      ).then((data) => setAdvertisingAccounts(data?.[0]?.data || []));
    }
  }, [businesses]);

  const handleSelectChange = (setter) => (event) => {
    if (event.target.value.length <= accountCount) {
      setter(event.target.value);
    } else {
      toast.warning(`En fazla ${accountCount} seçim yapabilirsiniz.`);
    }
  };

  const handleSave = async () => {
    if (
      selectedSites.length > accountCount ||
      selectedAnalytics.length > accountCount ||
      selectedAdvertisingAccount.length > accountCount
    ) {
      toast.warning(`Seçim sınırı (${accountCount}) aşıldı.`);
      return;
    }

    const payload = {
      selectedSites,
      selectedAnalytics,
      selectedAdvertisingAccount,
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.apiUrl}/Organization/save-selections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.success) {
          toast.success(`Hesap ayarları başarıyla kaydedildi!`);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error(`Hata oluştu!`);
      }
    } catch (error) {
      toast.error(`Hata oluştu!`);
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }} direction={{ xs: 'column', sm: 'row' }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom align="center">
          Hesap Ayarları
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} sx={{ p: 2 }}>
        <SelectWithCheckbox
          label="Search Console Siteleri"
          items={sites}
          selectedItems={selectedSites}
          onChange={handleSelectChange(setSelectedSites)}
          renderValueKey="siteUrl"
        />
      </Grid>

      <Grid item xs={12} sm={6} sx={{ p: 2 }}>
        <SelectWithCheckbox
          label="Analytics Hesapları"
          items={analyticsAccounts}
          selectedItems={selectedAnalytics}
          onChange={handleSelectChange(setSelectedAnalytics)}
          renderValueKey="displayName"
        />
      </Grid>

      <Grid item xs={12} sm={6} sx={{ p: 2 }}>
        <SelectWithCheckbox
          label="Meta Reklam Hesapları"
          items={advertisingAccounts}
          selectedItems={selectedAdvertisingAccount}
          onChange={handleSelectChange(setSelectedAdvertisingAccount)}
          renderValueKey="name"
        />
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="success" onClick={handleSave} size="large">
            Kaydet
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
