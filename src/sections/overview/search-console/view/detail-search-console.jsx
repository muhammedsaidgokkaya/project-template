import React, { useState, lazy, Suspense } from 'react';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const DataTableSearchConsole = lazy(() => import('../table/data-table'));

// ----------------------------------------------------------------------

export default function DetailSearchConsole({ startDate, endDate }) {
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
                    <Tab label="Sorgular" />
                    <Tab label="Sayfa Sayısı" />
                    <Tab label="Ülkeler" />
                    <Tab label="Cihazlar" />
                    <Tab label="Arama Görünümü" />
                    <Tab label="Tarihler" />
                </Tabs>
            </Box>
            <Box sx={{ width: '85%', pl: 2 }}>
                <Suspense fallback={<div>Yükleniyor...</div>}>
                    {currentDetailTab === 0 && <DataTableSearchConsole dimension="query" titleName="Sorgular" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 1 && <DataTableSearchConsole dimension="page" titleName="Sayfa Sayısı" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 2 && <DataTableSearchConsole dimension="country" titleName="Ülkeler" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 3 && <DataTableSearchConsole dimension="device" titleName="Cihazlar" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 4 && <DataTableSearchConsole dimension="searchAppearance" titleName="Arama Görünümleri" startDate={startDate} endDate={endDate} />}
                    {currentDetailTab === 5 && <DataTableSearchConsole dimension="date" titleName="Tarihler" startDate={startDate} endDate={endDate} />}
                </Suspense>
            </Box>
        </Box>
    );
}
