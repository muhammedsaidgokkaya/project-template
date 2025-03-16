import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { paths } from 'src/routes/paths';
import { KanbanItem } from './kanban-item';

// ----------------------------------------------------------------------

export function KanbanList({ tours = [] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentTours = tours.slice(startIndex, startIndex + itemsPerPage);

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
        {currentTours.map((tour) => (
          <KanbanItem
            key={tour.id}
            tour={tour}
            editHref={paths.dashboard.kanban.edit(tour.id)}
            detailsHref={paths.dashboard.kanban.details(tour.id)}
            onDelete={() => handleDelete(tour.id)}
          />
        ))}
      </Box>

      {tours.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(tours.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
