import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { MenuItem, Select } from "@mui/material";
import { BackLink } from './back-link';

const fDate = (dateString) => {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { PostCommentList } from './post-comment-list';
import { PostCommentForm } from './post-comment-form';
import { useGetPost } from 'src/actions/blog';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function KanbanDetailsContent({ tour, initialServices = [] }) {
  const [status, setStatus] = useState(tour.state);
  const [tourServiceOptions, setTourServiceOptions] = useState([]);
  const [userServiceOptions, setUserServiceOptions] = useState([]);

  const { title = '' } = useParams();
  const { post } = useGetPost(title);
  
  useEffect(() => {
    fetchSchemas();
    fetchUsers();
  }, []);

  const fetchSchemas = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${CONFIG.apiUrl}/Task/task-schemas?taskId=${tour.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTourServiceOptions(data);
    } catch (error) {
      console.error("şemalar çekerken hata oluştu", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${CONFIG.apiUrl}/Task/task-users?taskId=${tour.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUserServiceOptions(data);
    } catch (error) {
      console.error("kullanıcılar çekerken hata oluştu", error);
    }
  };
  
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
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };

  const daysPassed = Math.floor((new Date() - new Date(tour.createdDate)) / (1000 * 60 * 60 * 24));

  const daysText = daysPassed === 0 ? "Bugün" : `${daysPassed} gün önce`;

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

  const renderHead = () => (
    <>
      <Box sx={{ mb: 3, display: 'flex' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          <BackLink href={paths.dashboard.kanban.root} />
          {tour?.name} <span style={{ fontSize: '0.5em', color: 'gray' }}>{tour?.department}</span> 
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
        </Typography>
        <Select value={status} onChange={(event) => handleStatusChange(event, tour.id)} displayEmpty sx={{ maxHeight: 40 }}>
          <MenuItem value="0">Bekliyor</MenuItem>
          <MenuItem value="1">Devam Ediyor</MenuItem>
          <MenuItem value="2">Tamamlandı</MenuItem>
          <MenuItem value="3">İptal</MenuItem>
        </Select>
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
            {tour.state === 0 ? 'Bekliyor' : 
            tour.state === 1 ? 'Devam Ediyor' : 
            tour.state === 2 ? 'Tamamlandı' : 
            tour.state === 3 ? 'İptal' : ''}
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
          {tour?.createdUser} ekledi
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
          {fDate(tour.createdDate)} ({daysText})
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
          {fDate(tour.duration)} ({daysEndText})
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

  const [selectedServices, setSelectedServices] = useState([]);

  const handleToggle = async (service) => {
    const newSelectedServices = selectedServices.includes(service.id)
      ? selectedServices.filter(id => id !== service.id)
      : [...selectedServices, service.id];
  
    setSelectedServices(newSelectedServices);
  
    setTourServiceOptions(prevOptions =>
      prevOptions.map(item =>
        item.id === service.id ? { ...item, isFinished: !item.isFinished } : item
      )
    );

    const response = await fetch(
      `${CONFIG.apiUrl}/Task/update-task-template-task?taskTemplateTaskId=${service.id}`, 
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      }
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
          {tourServiceOptions.map((service) => {
            const checked = selectedServices.includes(service.id);

            return (
              <Box
                key={service.id}
                sx={{
                  gap: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: service.isFinished ? 'inherit' : 'text.disabled',
                }}
              >
                <Checkbox
                  checked={checked}
                  onChange={() => handleToggle(service)}
                  icon={<Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: service.isFinished ? 'primary.main' : 'text.disabled' }} />}
                  checkedIcon={<Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: service.isFinished ? 'primary.main' : 'text.disabled' }} />}
                />
                {service.name}
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
          {userServiceOptions.map((service) => (
            <Box
              key={service.label}
              sx={{
                gap: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {service.label} <span style={{ fontSize: '0.7em', color: 'gray' }}>{service.title}</span>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );

  const renderComment = () => (
    <>
      <PostCommentForm id={tour.id} />

      <Divider sx={{ mt: 5, mb: 2 }} />

      <PostCommentList taskId={tour.id} />
    </>
  );

  return (
    <>
      <Box
        sx={{
          mt: 3,
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        {renderHead()}

        <Divider sx={{ borderStyle: 'dashed', mt: 4, mb: 2 }} />

        {renderContent()}

        {renderComment()}
      </Box>
    </>
  );
}
