import React, { useEffect, useState } from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'

import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { fData } from 'src/utils/format-number';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Rapor Adı zorunludur!' }),
});

// ----------------------------------------------------------------------

export function SearchConsoleReportNew() {
  const [roles, setRoles] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(120, 'days'));
    const [endDate, setEndDate] = useState(dayjs());
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Genel');

    const fetchAccounts = async () => {
        try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CONFIG.apiUrl}/SearchConsole/search-console-account`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
        });
    
        const data = await response.json();
        setAccounts(data);
        setSelectedAccount(data[0].account);
        } catch (error) {
        console.error('Hesap verisi alınırken bir hata oluştu', error);
        }
    };

  const [currentUser, setCurrentUser] = useState({
    name: '',
  });

  const defaultValues = {
    name: '',
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const { name, account, typeId } = data;
    toast.warning('Raporunuz oluşturuluyor lütfen bekleyiniz!');
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.apiUrl}/Report/chatgpt-prompt-search-console?name=${name}&account=${selectedAccount}&accountId=${selectedAccount}&typeId=${selectedFilter}&reportType=3&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success('Rapor başarıyla oluşturuldu.');
        setTimeout(() => {
            window.location.href = '/dashboard/report/search-console';
        }, 1000);
      } else {
        toast.error('Rapor oluşturulamadı.');
      }
    } catch (error) {
      toast.error('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  });
  


  return (
    <DashboardContent>
        <CustomBreadcrumbs
        heading="Rapor Oluştur"
        links={[
            { name: 'Başlagıç', href: paths.dashboard.root },
            { name: 'Rapor' },
            { name: 'Search Console Raporları', href: paths.dashboard.report.search_console.root },
            { name: 'Rapor Oluştur' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        />
    
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Card sx={{ p: 3 }}>
                    <Box
                        sx={{
                        rowGap: 3,
                        columnGap: 2,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                    >
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <FormControl fullWidth>
                            <InputLabel>Search Console Hesapları</InputLabel>
                            <Select
                                value={selectedAccount}
                                onChange={(event) => setSelectedAccount(event.target.value)}
                                label="Search Console Hesapları"
                            >
                                {accounts.map((account) => (
                                <MenuItem key={account.accountId} value={account.accountId}>
                                    {account.account}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <Box
                            sx={{
                                gap: 2,
                                display: 'flex',
                                pr: { xs: 2.5, md: 1 },
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'flex-end', md: 'center' },
                            }}
                            >
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                                <DatePicker
                                label="Başlangıç Tarihi"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                                sx={{ maxWidth: { md: 400 } }}
                                />
                                <DatePicker
                                label="Bitiş Tarihi"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{
                                    textField: {
                                    fullWidth: true,
                                    },
                                }}
                                sx={{
                                    maxWidth: { md: 400 },
                                    [`& .MuiFormHelperText-root`]: {
                                    bottom: { md: -40 },
                                    position: { md: 'absolute' },
                                    },
                                }}
                                />
                            </LocalizationProvider>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel>Rapor Tipi</InputLabel>
                                <Select
                                    value={selectedFilter}
                                    onChange={(event) => setSelectedFilter(event.target.value)}
                                    label="Filtre Seçimi"
                                >
                                    <MenuItem value="Genel">Genel</MenuItem>
                                    <MenuItem value="Sorgu">Sorgu</MenuItem>
                                    <MenuItem value="Sayfa Sayısı">Sayfa Sayısı</MenuItem>
                                    <MenuItem value="Ülke">Ülke</MenuItem>
                                    <MenuItem value="Cihaz">Cihaz</MenuItem>
                                    <MenuItem value="Arama Görünümü">Arama Görünümü</MenuItem>
                                    <MenuItem value="Tarih">Tarih</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Field.Text name="name" label="Rapor İsmi" />
                        
                    </Box>

                    <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                        {isSubmitting && (
                          <Typography 
                            variant="body2" 
                            color="warning.main" 
                            sx={{ alignSelf: 'center', marginRight: 2 }}
                          >
                            Raporunuz oluşturuluyor... Lütfen rapor oluşturulana kadar bekleyiniz!
                          </Typography>
                        )}
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Kaydet
                        </LoadingButton>
                    </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    </DashboardContent>
  );
}
