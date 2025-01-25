import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function formatDateInTurkish(date) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function AudienceItem({ job }) {
  return (
    <>
      <Card>
        <Box sx={{ p: 3, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            title={job.name}
            primary={
              <Link
                component={RouterLink}
                color="inherit"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {job.name}
              </Link>
            }
            secondary={`Oluşturma Tarihi: ${formatDateInTurkish(job.timeCreated)}`}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
              color: 'primary.main',
            }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold" />
            <Typography variant="caption">
              Tahmini Hedef Kitle Büyüklüğü:
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'block',
              color: 'text.disabled',
            }}
          >
            {job.targetAudienceSize}
          </Typography>

          <Box
            sx={{
              gap: 0.5,
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
              color: 'primary.main',
            }}
          >
            <Typography variant="caption">
              {job.audienceTypeText}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{
            p: 3,
            pb: 0,
            rowGap: 1.5,
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
            <Box
              key={job.id}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption" noWrap>
                Son Güncelleme: {formatDateInTurkish(job.timeUpdated)}
              </Typography>
            </Box>
        </Box>
        <Box
          sx={{
            p: 3,
            pt: 2,
            pb: 0,
            rowGap: 1.5,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
            <Box
              key={job.id}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption" noWrap>
                Cinsiyet: {job.gender}
              </Typography>
            </Box>
            <Box
              key={job.id}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption" noWrap>
                Yaş Aralığı: {job.ageRange}
              </Typography>
            </Box>
        </Box>
        <Box
          sx={{
            p: 3,
            pt: 2,
            rowGap: 1.5,
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
            <Box
              key={job.id}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption" noWrap>
                Konum: {job.countries}
              </Typography>
            </Box>
        </Box>
      </Card>
    </>
  );
}
