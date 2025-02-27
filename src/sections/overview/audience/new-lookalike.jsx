import React, { useEffect, useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import LookalikeSizeSelector from "./size-selector";
import CountrySelector from "./country-selector";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import { CONFIG } from 'src/global-config';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { fData } from 'src/utils/format-number';
import { Form, Field, schemaHelper } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export function NewLookalike() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [ratio, setRatio] = useState(1);
    const [ratios, setRatios] = useState([2]);
    const [audienceCount, setAudienceCount] = useState(1);
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    const [selectedAudience, setSelectedAudience] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${CONFIG.apiUrl}/Meta/create-lookalike?selectedAccount=${selectedAccount}&selectedCountries=${selectedCountries}&ratios=${ratios}&selectedAudience=${selectedAudience}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
            setMessage(`Başarıyla oluşturuldu: ${JSON.stringify(data)}`);
        } catch (error) {
            setMessage("Hata oluştu: " + error.message);
        }
    
        setLoading(false);
    };

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

      const fetchAudiences = async (accountId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${CONFIG.apiUrl}/Meta/selected-audiences?accountId=${accountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
            setSelectedAudiences(data);
        } catch (error) {
            console.error('Audience verisi alınırken bir hata oluştu', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (selectedAccount) {
            fetchAudiences(selectedAccount);
        }
    }, [selectedAccount]);
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                }}
              >
                <FormControl fullWidth>
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
                <FormControl fullWidth>
                    <InputLabel>Kaynak</InputLabel>
                    <Select
                        value={selectedAudience}
                        onChange={(e) => setSelectedAudience(e.target.value)}
                        label="Kaynak"
                        disabled={selectedAudiences.length === 0}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    overflow: 'auto',
                                },
                            },
                        }}
                    >
                        {selectedAudiences.map((audience) => (
                            <MenuItem key={audience.id} value={audience.id}>
                                {audience.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                }}
              >
                <CountrySelector selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />

                <LookalikeSizeSelector ratios={ratios} setRatios={setRatios} audienceCount={audienceCount} setAudienceCount={setAudienceCount} />
              </Box>
              <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button
                    onClick={handleSubmit}
                    type="button"
                    variant="contained"
                >
                    Kaydet
                </Button>
              </Stack>
            </Card>
          </Grid>
      </Grid>
  );
}