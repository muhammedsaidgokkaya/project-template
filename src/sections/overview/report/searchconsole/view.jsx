import { useState, useEffect } from 'react';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { CONFIG } from 'src/global-config';
import DOMPurify from 'dompurify';

// ----------------------------------------------------------------------

export function ReportView({ id }) {
    const [currentReport, setCurrentReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwtToken');
            try {
                setLoading(true);
                const response = await fetch(`${CONFIG.apiUrl}/Report/report?id=${id}&reportType=3`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Veri yüklenirken hata oluştu');
                }

                const data = await response.json();
                setCurrentReport(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <Typography></Typography>;
    }

    const sanitizedContent = DOMPurify.sanitize(currentReport.content);

    return (
        <DashboardContent maxWidth="xl">
            <CustomBreadcrumbs
                heading={currentReport?.name}
                backHref={paths.dashboard.report.search_console.root}
                links={[
                    { name: 'Başlagıç', href: paths.dashboard.root },
                    { name: 'Rapor' },
                    { name: 'Search Console Raporları', href: paths.dashboard.report.search_console.root },
                    { name: currentReport?.name },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={12} className="report-content">
                    <Card sx={{ p: 3 }}>
                        <Box
                            sx={{
                                rowGap: 3,
                                columnGap: 2,
                                display: 'grid',
                                pl: 6,
                                pr: 6,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(5, 1fr)' },
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Rapor Adı</Typography>
                                <Typography variant="body2">{currentReport.name}</Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Hesap</Typography>
                                <Typography variant="body2">{currentReport.account}</Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Rapor Türü</Typography>
                                <Typography variant="body2">{currentReport.typeId}</Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tarih Aralığı</Typography>
                                <Typography variant="body2">{new Date(currentReport.startDate).toLocaleDateString('tr-TR')} - {new Date(currentReport.endDate).toLocaleDateString('tr-TR')}</Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 3,
                                    mb: 2,
                                    pl: 15,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={`${CONFIG.assetsDir}/assets/icons/files/ic-word.svg`}
                                    sx={{ width: 30, height: 30 }}
                                />
                                <Box
                                    component="img"
                                    src={`${CONFIG.assetsDir}/assets/icons/files/ic-pdf.svg`}
                                    sx={{ width: 30, height: 30 }}
                                />
                            </Box>
                        </Box>
                    </Card>
                    <Card sx={{ p: 3, mt: 3 }}>
                        <Box sx={{ mb: 2 }}>
                        <Typography 
                            variant="body1" 
                            sx={{
                                whiteSpace: 'pre-line',
                                lineHeight: 2.6,
                                pl: 6,
                                pr: 6,
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
