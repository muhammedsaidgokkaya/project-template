import React, { useEffect, useState } from 'react';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Organizasyon Adı zorunludur!' }),
  orgAddress: zod.string().min(1, { message: 'Organizasyon Adresi zorunludur!' }),
  zipCode: zod
    .string()
    .min(1, { message: 'Zip Kodu zorunludur!' })
    .regex(/^\d+$/, { message: 'Zip Kodu sadece sayısal değerlerden oluşmalıdır!' }),
  taskNumber: zod
    .string()
    .min(1, { message: 'Vergi No zorunludur!' })
    .regex(/^\d+$/, { message: 'Vergi No sadece sayısal değerlerden oluşmalıdır!' }),
  firstName: zod.string().min(1, { message: 'Ad zorunludur!' }),
  lastName: zod.string().min(1, { message: 'Soyad zorunludur!' }),
  mail: zod
    .string()
    .min(1, { message: 'E-Posta zorunludur!' })
    .email({ message: 'E-posta geçerli bir e-posta adresi olmalıdır!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  title: zod.string().min(1, { message: 'Ünvan zorunludur!' }),
  dateOfBirth: zod.string().min(1, { message: 'Doğum Tarihi zorunludur!' }),
  address: zod.string().min(1, { message: 'Adres zorunludur!' }),
  gender: zod.enum(['E', 'K'], { message: 'Cinsiyet seçmek zorunludur!' }),
});

// ----------------------------------------------------------------------

export function RegisterAppView() {

  const [currentUser, setCurrentUser] = useState({
    name: '',
    orgAddress: '',
    zipCode: '',
    taskNumber: '',
    photoURL: '',
    firstName: '',
    lastName: '',
    mail: '',
    phone: '',
    title: '',
    dateOfBirth: '',
    address: '',
    gender: '',
  });

  const defaultValues = {
    name: '',
    orgAddress: '',
    zipCode: '',
    taskNumber: '',
    photoURL: '',
    firstName: '',
    lastName: '',
    mail: '',
    phone: '',
    title: '',
    dateOfBirth: '',
    address: '',
    gender: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch(`${CONFIG.apiUrl}/Register/add-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          orgAddress: data.orgAddress,
          zipCode: data.zipCode,
          taskNumber: data.taskNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          mail: data.mail,
          phone: data.phone,
          title: data.title,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          gender: data.gender
        })
      });

      const result = await response.json();
      const userId = result.id;

      const photo = methods.getValues('photoURL');
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("userId", userId);

      const responsePhoto = await fetch(`${CONFIG.apiUrl}/Register/add-photo`, {
        method: "POST",
        body: formData,
      });
      const resultPhoto = await responsePhoto.json();

      toast.success("Kayıt oluşturuldu!", { duration: 3000 });
      toast.success("Lütfen mailinize gönderilen giriş bilgileriyle giriş yapınız!", { duration: 5000 });
      window.location.href = '/login';
    } catch (error) {
      toast.error("Bir hata oluştu!");
    }
  });

  return (
      <Form methods={methods} onSubmit={onSubmit}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Kayıt Ol
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="name" label="Organizasyon Adı" />
                <Field.Text name="taskNumber" label="Vergi No" />
                <Field.Text name="orgAddress" multiline rows={4} label="Adres" />
                <Field.Text name="zipCode" label="Zip Kodu" />
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                pt: 10,
                pb: 5,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Field.UploadAvatar
                name="photoURL"
                onChange={(event) => {
                  const file = event.target.files[0];
                  methods.setValue('photoURL', [file]);
                  
                }}
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    İzin verilen maksimum *.jpeg, *.jpg,
                    <br /> *.png, *.gif boyutu: {fData(3145728)}
                  </Typography>
                }
              />
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="firstName" label="Ad" />
                <Field.Text name="lastName" label="Soyad" />
                <Field.Text name="mail" label="E-Posta" />
                <Field.Phone name="phone" label="Telefon" country='TR' />
                <Field.Text name="title" label="Ünvan" />
                <Field.DatePicker name="dateOfBirth" label="Doğum Tarihi" />
                <Field.Text name="address" multiline rows={4} label="Adres" />
                <Field.RadioGroup
                  name="gender"
                  label="Cinsiyet"
                  options={[
                    { value: 'E', label: 'Erkek' },
                    { value: 'K', label: 'Kadın' },
                  ]}
                />
              </Box>

              <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Kaydet
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
  );
}
