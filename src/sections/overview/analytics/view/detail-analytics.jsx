import React, { useState, lazy, Suspense } from 'react';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const DataTableAnalytics = lazy(() => import('../table/data-table'));

// ----------------------------------------------------------------------

export default function DetailAnalytics({ selectedAccount, startDate, endDate }) {
    const [currentDetailTab, setCurrentDetailTab] = useState(0);

    const handleDetailTabChange = (event, newValue) => {
        setCurrentDetailTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '50vh', p: 1 }}>
            <Box sx={{ width: '15%', pr: 1 }}>
                <Tabs
                    value={currentDetailTab}
                    onChange={handleDetailTabChange}
                    orientation="vertical"
                    variant="scrollable"
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            gap: '15px',
                        },
                        '& .MuiTab-root': {
                            fontWeight: 300,
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            marginBottom: 0.5,
                            minHeight: 'auto',
                            padding: '2px 2px',
                        },
                    }}
                >
                    <Tab label="Kitleler" />
                    <Tab label="Varsayılan Kanal Grubu" />
                    <Tab label="Açılış Sayfası" />
                    <Tab label="Sayfa Başlığı" />
                    <Tab label="Sayfa Yolu ve Ekran Sınıfı" />
                    <Tab label="Sayfa Başlığı ve Ekran Sınıfı" />
                    <Tab label="Etkinlik" />
                    <Tab label="Tarayıcı" />
                    <Tab label="Dil" />
                    <Tab label="Kıta" />
                    <Tab label="Ülke" />
                    <Tab label="Şehir" />
                </Tabs>
            </Box>
            <Box sx={{ width: '85%', pl: 2 }}>
                <Suspense fallback={<div>Yükleniyor...</div>}>
                    {currentDetailTab === 0 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="audienceName" titleName="Kitle" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 1 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="sessionDefaultChannelGroup" titleName="Varsayılan Kanal Grubu" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 2 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="landingPage" titleName="Açılış Sayfası" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 3 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="pageTitle" titleName="Sayfa Başlığı" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 4 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="unifiedPagePathScreen" titleName="Sayfa Yolu ve Ekran Sınıfı" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 5 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="unifiedScreenClass" titleName="Sayfa Başlığı ve Ekran Sınıfı" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 6 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="eventName" titleName="Etkinlik" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 7 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="browser" titleName="Tarayıcı" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 8 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="language" titleName="Dil" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 9 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="continent" titleName="Kıta" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 10 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="country" titleName="Ülke" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 11 && <DataTableAnalytics selectedAccount={selectedAccount} dimension="city" titleName="Şehir" startDate={startDate} endDate={endDate} />}
                </Suspense>
            </Box>
        </Box>
    );
}
