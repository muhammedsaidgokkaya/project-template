import { useState, useEffect } from 'react';
import { z as zod } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CONFIG } from 'src/global-config';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export const NewTourSchema = zod.object({
  name: zod.array(zod.string().min(1, { message: 'Name is required!' })).min(1, { message: 'At least one name is required!' }),
});

export function SchemaEditForm({ currentSchema }) {
  const defaultValues = {
    name: currentSchema ?? [],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewTourSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'name',
  });

  useEffect(() => {
    if (currentSchema) {
      reset({ name: [...currentSchema] });
    }
  }, [currentSchema, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${CONFIG.apiUrl}/Task/add-schema`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
        })
      });
  
      if (!response.ok) {
        throw new Error('Error submitting form data');
      }
      toast.success("Şema başarıyla güncellendi!");
      setTimeout(() => {
        window.location.href = '/dashboard/kanban/schema';
      }, 1000);
    } catch (error) {
      toast.error('An error occurred while submitting the form');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ mx: 'auto', ml: 5, mr: 5 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mx: 'auto', mb: 3 }}>Anahtar Kelimeler</Typography>
          <Stack spacing={2}>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  {...methods.register(`name.${index}`)}
                  label={`Anahtar Kelime ${index + 1}`}
                  variant="outlined"
                />
                <IconButton onClick={() => remove(index)}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Box>
            ))}
            <Button variant="contained" onClick={() => append('')} sx={{ mt: 1 }}>
              Yeni Anahtar Kelime Ekle
            </Button>
          </Stack>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {currentSchema ? 'Kaydet' : 'Kaydet'}
          </LoadingButton>
        </Box>
      </Stack>
    </Form>
  );
}
