import { useState, useCallback } from 'react';
import { useTabs } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { TOUR_DETAILS_TABS, TOUR_PUBLISH_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';

import { KanbanDetailsContent } from '../kanban-details-content';
import { KanbanDetailsToolbar } from '../kanban-details-toolbar';

// ----------------------------------------------------------------------

export function KanbanDetailsView({ tour }) {
  const [publish, setPublish] = useState(tour?.publish);

  const tabs = useTabs('content');

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const renderToolbar = () => (
    <KanbanDetailsToolbar
      backHref={paths.dashboard.kanban.root}
      editHref={paths.dashboard.kanban.edit(`${tour?.id}`)}
      liveHref="#"
      publish={publish || ''}
      onChangePublish={handleChangePublish}
      publishOptions={TOUR_PUBLISH_OPTIONS}
    />
  );

  const renderTabs = () => (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'bookers' ? <Label variant="filled">{tour?.bookers.length}</Label> : ''
          }
        />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent>
      {renderToolbar()}
      <KanbanDetailsContent tour={tour} />
    </DashboardContent>
  );
}
