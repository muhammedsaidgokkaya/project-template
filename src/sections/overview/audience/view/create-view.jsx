import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewCustom } from '../new-custom';
import { NewLookalike } from '../new-lookalike';
import { NewSaved } from '../new-saved';

// ----------------------------------------------------------------------

export function CreateView() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Hedef Kitle Ekle"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Organizasyon' },
          { name: 'Hedef Kitle', href: paths.dashboard.audience.root },
          { name: 'Yeni Hedef Kitle' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box sx={{ mb: 1 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange} 
          variant="scrollable"
        >
          <Tab label="Özel Hedef Kitle" />
          <Tab label="Benzer Hedef Kitle" />
          <Tab label="Kaydedilen Hedef Kitle" />
        </Tabs>
      </Box>

      <Box>
        {currentTab === 0 && <NewCustom />}
        {currentTab === 1 && <NewLookalike />}
        {currentTab === 2 && <NewSaved />}
      </Box>
    </DashboardContent>
  );
}
