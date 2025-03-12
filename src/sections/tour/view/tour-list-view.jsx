import { orderBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
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

import { TourList } from '../tour-list';
import { TourSort } from '../tour-sort';
import { TourSearch } from '../tour-search';
import { TourFilters } from '../tour-filters';
import { TourFiltersResult } from '../tour-filters-result';

// ----------------------------------------------------------------------

export function TourListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const filters = useSetState({
    destination: [],
    tourGuides: [],
    services: [],
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: _tours,
    filters: currentFilters,
    sortBy,
    dateError,
  });

  const canReset =
    currentFilters.destination.length > 0 ||
    currentFilters.tourGuides.length > 0 ||
    currentFilters.services.length > 0 ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

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
          <Tab label="Tümü" />
          <Tab label="Bekliyor" />
          <Tab label="Devam Ediyor" />
          <Tab label="Tamamlandı" />
          <Tab label="İptal Edildi" />
        </Tabs>
      </Stack>

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <TourList tours={dataFiltered} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy, dateError }) {
  return inputData;
}
