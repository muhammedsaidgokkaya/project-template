import { orderBy } from 'es-toolkit';
import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from 'src/global-config';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _tours, _tourGuides, TOUR_SORT_OPTIONS, TOUR_SERVICE_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KanbanList } from '../kanban-list';

// ----------------------------------------------------------------------

export function KanbanListView() {
  const [tasks, setTasks] = useState([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`${CONFIG.apiUrl}/Task/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tabFromHash = parseInt(hash.replace('#', ''), 10);
      if (!isNaN(tabFromHash)) {
        setTabIndex(tabFromHash);
      }
    }
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    window.location.hash = `#${newIndex}`;
  };

  const filteredTasks = tasks.filter((task) => {
    switch (tabIndex) {
      case 0:
        return task.state === 0;
      case 1:
        return task.state === 1;
      case 2:
        return task.state === 2;
      case 3:
        return task.state === 3;
      default:
        return true;
    }
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Görevler"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Görevler' },
        ]}
        action={
          <>
            <Button
              component={RouterLink}
              href={paths.dashboard.kanban.schema}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Görev Şeması Oluştur
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.kanban.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Yeni Görev
            </Button>
          </>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Tümü" value={-1} />
          <Tab label="Bekliyor" value={0} />
          <Tab label="Devam Ediyor" value={1} />
          <Tab label="Tamamlandı" value={2} />
          <Tab label="İptal Edildi" value={3} />
        </Tabs>
      </Stack>

      {loading ? (
        <p></p>
      ) : error ? (
        <p></p>
      ) : (
        <KanbanList tours={filteredTasks} />
      )}
    </DashboardContent>
  );
}
