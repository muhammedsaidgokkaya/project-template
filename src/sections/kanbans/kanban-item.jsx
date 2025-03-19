
import { useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import { CONFIG } from 'src/global-config';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Select, FormControl } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
const fDate = (dateString) => {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function KanbanItem({ tour, editHref, detailsHref, onDelete }) {
  const menuActions = usePopover();
  const [status, setStatus] = useState(tour.state);

  const handleStatusChange = async (event, taskId) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
  
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${CONFIG.apiUrl}/Task/update-task-state?taskId=${taskId}&state=${newStatus}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Görev durumu güncellenemedi!");
      }
  
      const result = await response.json();
      toast.success('Görev durumu güncellendi!');
      setTimeout(() => {
        window.location.href = `/dashboard/kanban#${newStatus}`;
        window.location.reload();
      }, 200);
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };
  
  const daysPassed = Math.floor((new Date() - new Date(tour.createdDate)) / (1000 * 60 * 60 * 24));

  const daysText = daysPassed === 0 ? "Bugün" : `${daysPassed} gün önce`;

  const renderTexts = () => (
    <ListItemText
      sx={[(theme) => ({ p: theme.spacing(2.5, 2.5, 2, 2.5) })]}
      primary={`Oluşturma tarihi: ${fDate(tour.createdDate)} (${daysText})`}
      secondary={
        <Link component={RouterLink} href={detailsHref} color="inherit">
         {tour.name}
         <Iconify
            icon={
              (tour.priority === 0 && 'solar:double-alt-arrow-down-bold-duotone') ||
              (tour.priority === 1 && 'solar:double-alt-arrow-right-bold-duotone') ||
              'solar:double-alt-arrow-up-bold-duotone'
            }
            sx={{
              ml: 1,
              position: 'relative',
              top: '4px',
              ...(tour.priority === 0 && { color: 'info.main' }),
              ...(tour.priority === 1 && { color: 'warning.main' }),
              ...(tour.priority === 2 && { color: 'error.main' }),
            }}
          />
        </Link>
      }
      primaryTypographyProps={{ typography: 'caption', color: 'text.disabled' }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const endDate = new Date(tour.duration);
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

    const renderInfo = () => (
      
      <Stack
      spacing={1.5}
      sx={[
        (theme) => ({
          position: 'relative',
          p: theme.spacing(0, 2.5, 2.5, 2.5),
        }),
      ]}
    >
      <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', bottom: 20, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="fluent:status-12-regular" sx={{ color: 'error.main' }} />
          <FormControl size="small">
            <Select value={status} onChange={(event) => handleStatusChange(event, tour.id)} displayEmpty>
              <MenuItem value="0">Bekliyor</MenuItem>
              <MenuItem value="1">Devam Ediyor</MenuItem>
              <MenuItem value="2">Tamamlandı</MenuItem>
              <MenuItem value="3">İptal</MenuItem>
            </Select>
          </FormControl>
        </Box>
      {[
        {
          icon: <Iconify icon="flat-color-icons:manager" sx={{ color: 'error.main' }} />,
          label: tour.createdUser + ' ekledi',
        },
        {
          icon: <Iconify icon="solar:clock-circle-bold" sx={{ color: 'info.main' }} />,
          label: `${fDate(tour.duration)} (${daysEndText})`,
        },
        {
          icon: <Iconify icon="solar:users-group-rounded-bold" sx={{ color: 'primary.main' }} />,
          label: `${tour.team} Kişi`,
        },
      ].map((item) => (
        <Box
          key={item.label}
          sx={[
            () => ({
              gap: 0.5,
              display: 'flex',
              typography: 'body2',
              alignItems: 'center',
            }),
          ]}
        >
          {item.icon}
          {item.label}
        </Box>
      ))}
    </Stack>
    );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Görüntüle
          </MenuItem>
        </li>

        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Düzenle
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Sil
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card>
        {renderTexts()}
        {renderInfo()}
      </Card>

      {renderMenuActions()}
    </>
  );
}
