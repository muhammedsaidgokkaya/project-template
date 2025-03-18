import { orderBy } from 'es-toolkit';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CONFIG } from 'src/global-config';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import { Label } from 'src/components/label';
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
  const hash = window.location.hash.replace('#', '');
  const tabFromHash = parseInt(hash, 10);
  if (!isNaN(tabFromHash) && [-1, 0, 1, 2, 3].includes(tabFromHash)) {
    setTabIndex(tabFromHash);
  }
}, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    window.location.hash = `#${newIndex}`;
    setTasks([...tasks]);
  };

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      waiting: tasks.filter(task => task.state === 0).length,
      inProgress: tasks.filter(task => task.state === 1).length,
      completed: tasks.filter(task => task.state === 2).length,
      cancelled: tasks.filter(task => task.state === 3).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
  }, [tasks, tabIndex]);

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
          <Tab
            key={-1}
            value={-1}
            label='Tümü'
            icon={
              <Label
                variant='filled'
                color='default'
              >
                {taskCounts.all}
              </Label>
            }
          />
          <Tab
            key={0}
            value={0}
            label='Bekliyor'
            icon={
              <Label
                variant='soft'
                color='warning'
              >
                {taskCounts.waiting}
              </Label>
            }
          />
          <Tab
            key={1}
            value={1}
            label='Devam Ediyor'
            icon={
              <Label
                variant='soft'
                color='info'
              >
                {taskCounts.inProgress}
              </Label>
            }
          />
          <Tab
            key={2}
            value={2}
            label='Tamamlandı'
            icon={
              <Label
                variant='soft'
                color='success'
              >
                {taskCounts.completed}
              </Label>
            }
          />
          <Tab
            key={3}
            value={3}
            label='İptal Edildi'
            icon={
              <Label
                variant='soft'
                color='error'
              >
                {taskCounts.cancelled}
              </Label>
            }
          />
        </Tabs>
      </Stack>

      {loading ? (
        <p></p>
      ) : error ? (
        <p></p>
      ) : (
        <KanbanList key={tabIndex} tours={filteredTasks} />
      )}
    </DashboardContent>
  );
}
