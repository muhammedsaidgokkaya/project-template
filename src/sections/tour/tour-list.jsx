import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { TourItem } from './tour-item';

// ----------------------------------------------------------------------

export function TourList({ tours }) {
  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {tours.map((tour) => (
          <TourItem
            key={tour.id}
            tour={tour}
            editHref={paths.dashboard.kanban.edit(tour.id)}
            detailsHref={paths.dashboard.kanban.details(tour.id)}
            onDelete={() => handleDelete(tour.id)}
          />
        ))}
      </Box>
    </>
  );
}
