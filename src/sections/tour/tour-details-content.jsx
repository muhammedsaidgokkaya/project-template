import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { MenuItem, Select } from "@mui/material";

import { fDate } from 'src/utils/format-time';

import { TOUR_SERVICE_OPTIONS } from 'src/_mock';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import { PostCommentList } from './post-comment-list';
import { PostCommentForm } from './post-comment-form';
import { useGetPost } from 'src/actions/blog';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function TourDetailsContent({ tour, initialServices = [] }) {
  const slides = tour?.images.map((slide) => ({ src: slide })) || [];
  const [status, setStatus] = useState(0);

  const { title = '' } = useParams();
  const { post, postLoading, postError } = useGetPost(title);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const daysPassed = Math.floor((new Date() - new Date(tour.createdAt)) / (1000 * 60 * 60 * 24));

  const daysText = daysPassed === 0 ? "Bugün" : `${daysPassed} gün önce`;

  const endDate = new Date(tour.available.endDate);
  const today = new Date();
  const timeDiff = endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  let daysEndText;
    if (daysLeft > 0) {
      daysEndText = `${daysLeft} gün kaldı`;
    } else if (daysLeft === 0) {
      daysEndText = "Bugün son";
    } else {
      daysEndText = `${Math.abs(daysLeft)} gün geçti`;
    }

  const renderHead = () => (
    <>
      <Box sx={{ mb: 3, display: 'flex' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {tour?.name}
        </Typography>

        {/* <IconButton>
          <Iconify icon="solar:share-bold" />
        </IconButton> */}
        <Select
          value={status}
          onChange={handleChange}
          sx={{ minWidth: 200, maxHeight: 50 }}
        >
          <MenuItem value="0">Bekliyor</MenuItem>
          <MenuItem value="1">Devam Ediyor</MenuItem>
          <MenuItem value="2">Tamamlandı</MenuItem>
          <MenuItem value="3">İptal</MenuItem>
        </Select>
        {/* <Checkbox
          defaultChecked
          color="error"
          icon={<Iconify icon="solar:heart-outline" />}
          checkedIcon={<Iconify icon="solar:heart-bold" />}
          inputProps={{ id: 'favorite-checkbox', 'aria-label': 'Favorite checkbox' }}
        /> */}
      </Box>

      <Box
        sx={{
          gap: 5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="fluent:status-12-regular" sx={{ color: 'error.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            Bekliyor
          </Box>
        </Box>

        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="flat-color-icons:manager" sx={{ color: 'error.main' }} />
          {tour?.destination} ekledi
        </Box>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="solar:clock-circle-bold" sx={{ color: 'info.main' }} />
          {fDate(tour.createdAt)} ({daysText})
        </Box>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="solar:clock-circle-bold" sx={{ color: 'warning.main' }} />
          {fDate(tour.available.endDate)} ({daysEndText})
        </Box>
      </Box>
    </>
  );

  const renderOverview = () => (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
      }}
    >
      {[
        {
          label: 'Termin Süresi',
          value: `${fDate(tour.available.endDate)} (${daysEndText})`,
          icon: <Iconify icon="solar:clock-circle-bold" sx={{ color: 'info.main' }} />,
        },
        {
          label: 'Ekip',
          value: `${tour.bookers.length} Kişi`,
          icon: <Iconify icon="solar:users-group-rounded-bold" sx={{ color: 'primary.main' }} />,
        },
      ].map((item) => (
        <Box key={item.label} sx={{ gap: 1.5, display: 'flex' }}>
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.primary',
              typography: 'subtitle2',
            }}
          />
        </Box>
      ))}
    </Box>
  );

  const [selectedServices, setSelectedServices] = useState(initialServices);

  const handleToggle = (label) => {
    setSelectedServices((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const renderContent = () => (
    <>
      <Markdown children={tour?.content} />

      <Divider sx={{ borderStyle: 'dashed', mt: 4, mb: 2 }} />

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Anahtar Kelime
        </Typography>

        <Box
          sx={{
            rowGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          {TOUR_SERVICE_OPTIONS.map((service) => {
          const checked = selectedServices.includes(service.label);

          return (
            <Box
              key={service.label}
              sx={{
                gap: 1,
                display: 'flex',
                alignItems: 'center',
                color: checked ? 'text.disabled' : 'inherit',
              }}
            >
              <Checkbox
                checked={checked}
                onChange={() => handleToggle(service.label)}
                icon={<Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: 'primary.main' }} />}
                checkedIcon={<Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: 'text.disabled' }} />}
              />
              {service.label}
            </Box>
          );
        })}
        </Box>
      </Box>
      
      <Divider sx={{ borderStyle: 'dashed', mt: 4, mb: 2 }} />

      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ekip
        </Typography>

        <Box
          sx={{
            rowGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          {TOUR_SERVICE_OPTIONS.map((service) => (
            <Box
              key={service.label}
              sx={{
                gap: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {service.label}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );

  const renderComment = () => (
    <>
      <PostCommentForm />

      <Divider sx={{ mt: 5, mb: 2 }} />

      <PostCommentList comments={post?.comments ?? []} />
    </>
  );

  return (
    <>
      
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        {renderHead()}
{/* 
        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview()} */}

        <Divider sx={{ borderStyle: 'dashed', mt: 4, mb: 2 }} />

        {renderContent()}

        {renderComment()}
      </Box>
    </>
  );
}
