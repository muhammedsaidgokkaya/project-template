import React, { useEffect, useState, useCallback } from 'react';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { EmptyContent } from 'src/components/empty-content';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AudienceList } from '../audience-list';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function OverviewAudienceView() {
  const [audiences, setAudiences] = useState([]);
  const [filteredAudiences, setFilteredAudiences] = useState([]);
  const [selectedAudienceType, setSelectedAudienceType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.apiUrl}/Meta/meta-account`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setAccounts(data);
      setSelectedAccount(data[0].accountId);
    } catch (error) {
      console.error('Hesap verisi alınırken bir hata oluştu', error);
    }
  };

  const fetchAudiences = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken'); 
      const response = await fetch(`${CONFIG.apiUrl}/Meta/audiences?accountId=${selectedAccount}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Veriler alınırken bir hata oluştu!');
      }
      const data = await response.json();
      setAudiences(data);
      setFilteredAudiences(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchAudiences();
    }
  }, [fetchAudiences, selectedAccount]);

  useEffect(() => {
    if (selectedAudienceType != 'all') {
      setFilteredAudiences(
        audiences.filter((audience) => audience.audienceType === selectedAudienceType)
      );
    } else {
      setFilteredAudiences(audiences);
    }
  }, [selectedAudienceType, audiences]);

  const notFound = !filteredAudiences.length && !loading;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Hedef Kitle"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Hedef Kitle' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      
      <Stack spacing={2.5} sx={{ mt: 3, mb: { xs: 3, md: 3 } }}>
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
          }}
        >
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Reklam Hesapları</InputLabel>
            <Select
              value={selectedAccount}
              onChange={(event) => setSelectedAccount(event.target.value)}
              label="Reklam Hesapları"
            >
              {accounts.map((account) => (
                <MenuItem key={account.accountId} value={account.accountId}>
                  {account.account}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Tipi</InputLabel>
              <Select
                value={selectedAudienceType}
                onChange={(event) => setSelectedAudienceType(event.target.value)}
                label="Tipi"
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="saved">Kaydedilen Hedef Kitle</MenuItem>
                <MenuItem value="custom">Özel Hedef Kitle</MenuItem>
                <MenuItem value="lookalike">Benzer Hedef Kitle</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Stack>
      
      {loading && <div></div>}
      {error && <div>{error}</div>}
      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <AudienceList jobs={filteredAudiences} />
    </DashboardContent>
  );
}
