import { useState, useEffect } from 'react';
import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Autocomplete, TextField, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { CONFIG } from 'src/global-config';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fIsAfter } from 'src/utils/format-time';

import { _tags, _tourGuides, TOUR_SERVICE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const JOB_EXPERIENCE_OPTIONS = [
  { label: 'Düşük Öncelik', value: 0 },
  { label: 'Orta Öncelik', value: 1 },
  { label: 'Yüksek Öncelik', value: 2 },
];

// ----------------------------------------------------------------------

export const NewTourSchema = zod
  .object({
    name: zod.string().min(1, { message: 'Görev adı zorunludur!' }),
    content: schemaHelper
      .editor()
      .min(1, { message: 'Açıklama alanı zorunludur!' }),
    durations: schemaHelper.date({ message: { required: 'Bitiş süresi belirleyiniz!' } }),
    priority: zod
      .coerce.number()
      .refine(value => [0, 1, 2].includes(value), {
        message: 'Geçersiz öncelik!',
      }),
  });

// ----------------------------------------------------------------------

export function KanbanNewEditForm({ currentTour }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tourServiceOptions, setTourServiceOptions] = useState([]);
  const [selectedServiceOptions, setSelectedServiceOptions] = useState([]);
  const [departmentsError, setDepartmentsError] = useState('');
  const [usersError, setUsersError] = useState('');
  const [servicesError, setServicesError] = useState('');

  const validateDepartments = () => {
    if (selectedDepartments.length < 1) {
      setDepartmentsError('En az bir departman seçmeniz gerekiyor!');
      return false;
    }
    setDepartmentsError('');
    return true;
  };
  const validateUsers = () => {
    if (selectedUsers.length < 1) {
      setUsersError('En az bir kullanıcı seçmeniz gerekiyor!');
      return false;
    }
    setUsersError('');
    return true;
  };
  const validateServices = () => {
    if (selectedServiceOptions.length < 1) {
      setServicesError('En az bir anahtar kelime seçmeniz gerekiyor!');
      return false;
    }
    setServicesError('');
    return true;
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
    fetchSchemas();
  }, []);

  useEffect(() => {
    fetchUsers(selectedDepartments);
  }, [selectedDepartments]);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${CONFIG.apiUrl}/Organization/departments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Departmanları çekerken hata oluştu", error);
    }
  };

  const fetchUsers = async (departmentFilter = []) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      let url = new URL(`${CONFIG.apiUrl}/Organization/users`);
  
      if (departmentFilter.length > 0) {
        url = new URL(`${CONFIG.apiUrl}/Organization/department-users`);
        
        departmentFilter.forEach(dep => {
          if (dep) {
            url.searchParams.append("department", dep);
          }
        });
      }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Kullanıcıları çekerken hata oluştu", error);
      setUsers([]);
    }
    setLoading(false);
  };
  
  const fetchSchemas = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${CONFIG.apiUrl}/Task/schemas`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTourServiceOptions(data);
    } catch (error) {
      console.error("şem alar çekerken hata oluştu", error);
    }
  };

  const router = useRouter();

  const defaultValues = {
    name: '',
    content: '',
    durations: null,
    priority: 1,
    departments: [],
    users: [],
    services: [],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewTourSchema),
    defaultValues,
    values: currentTour,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {  
      const isDepartmentsValid = validateDepartments();
      const isUsersValid = validateUsers();
      const isServicesValid = validateServices();
      if (!isDepartmentsValid || !isUsersValid || !isServicesValid) return;
      const response = await fetch(`${CONFIG.apiUrl}/Task/add-task`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          content: data.content,
          durations: data.durations,
          priority: data.priority,
          departments: selectedDepartments,
          users: selectedUsers.map(user => user.id),
          services: selectedServiceOptions.map(service => service.id),
        })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success(currentTour ? 'Update success!' : 'Görev başarıyla oluşturuldu!');
        router.push(paths.dashboard.kanban.root);
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting data');
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered, { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const renderDetails = () => (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Field.Text name="name" placeholder="Görev Adı" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">İçerik</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Box sx={{ gap: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Field.RadioGroup
              row
              name="priority"
              options={JOB_EXPERIENCE_OPTIONS}
              sx={{ gap: 4 }}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Box sx={{ gap: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <Field.DatePicker name="durations" label="Bitiş Tarihi" />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Ayarlar"
        subheader="Şema oluşturma ve kullanıcıya görev atama"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Departman</Typography>
          <Autocomplete
            name="departments"
            multiple
            options={departments}
            getOptionLabel={(option) => option}
            value={selectedDepartments}
            onChange={(event, newValue) => {
              setSelectedDepartments(newValue);
              setSelectedUsers([]);
            }}
            renderInput={(params) => <TextField {...params} label="+ Departman Seçiniz" variant="outlined" error={!!departmentsError} helperText={departmentsError} />}
            sx={{ mt: 1 }}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            Ekip
          </Typography>
          {loading ? (
            <CircularProgress sx={{ display: "block", mx: "auto", mt: 2 }} />
          ) : (
            <Autocomplete
              name="users"
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              value={selectedUsers}
              onChange={(event, newValue) => setSelectedUsers(newValue)}
              renderInput={(params) => <TextField {...params} label="+ Kullanıcı Seçiniz" variant="outlined" error={!!usersError} helperText={usersError} />}
              sx={{ mt: 1 }}
            />
          )}
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Anahtar Kelime</Typography>
          <Autocomplete
            name="services"
            multiple
            options={tourServiceOptions}
            getOptionLabel={(option) => option.name}
            value={selectedServiceOptions}
            onChange={(event, newValue) => {
              setSelectedServiceOptions(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="+ Anahtar Kelime Seçiniz" variant="outlined" error={!!servicesError} helperText={servicesError} />}
            sx={{ mt: 1 }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1, pl: 3 }}></Box>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentTour ? 'Görevi oluştur' : 'Kaydet'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', ml: 5, mr: 5 }}>
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
