import Box from '@mui/material/Box';
// import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { AudienceItem } from './audience-item';

// ----------------------------------------------------------------------

export function AudienceList({ jobs }) {
  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        {jobs.map((job) => (
          <AudienceItem
            key={job.id}
            job={job}
          />
        ))}
      </Box>

      {/* {jobs.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )} */}
    </>
  );
}
