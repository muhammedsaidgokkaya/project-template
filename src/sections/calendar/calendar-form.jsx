import { z as zod } from 'zod';
import { useCallback } from 'react';
import { uuidv4 } from 'minimal-shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { fIsAfter } from 'src/utils/format-time';

import { createEvent, updateEvent, deleteEvent } from 'src/actions/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // Türkçe dil desteği ekleniyor

// Dayjs dilini Türkçe yap
dayjs.locale("tr");
import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export const EventSchema = zod.object({
  title: zod
    .string()
    .min(1, { message: 'Başlık alanı zorunludur!' })
    .max(100, { message: 'Başlık 100 karakterden az olmalıdır!' }),
  description: zod
    .string()
    .min(1, { message: 'Açıklama alanı zorunludur!' })
    .max(500, { message: 'Açıklama 500 karakterden az olmalıdır' }),
  color: zod.string(),
  allDay: zod.boolean(),
  start: zod.union([zod.string(), zod.number()]),
  end: zod.union([zod.string(), zod.number()]),
});

// ----------------------------------------------------------------------

export function CalendarForm({ currentEvent, colorOptions, onClose }) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = fIsAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    const eventData = {
      id: currentEvent?.id ? currentEvent?.id : 0,
      color: data?.color,
      title: data?.title,
      allDay: data?.allDay,
      description: data?.description,
      end: data?.end,
      start: data?.start,
    };

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          await createEvent(eventData);
          toast.success('Güncelleme işlemi başarıyla gerçekleşti!');
        } else {
          await createEvent(eventData);
          toast.success('Kayıt işlemi başarıyla gerçekleşti!');
        }
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(`${currentEvent?.id}`);
      toast.success('Silme işlemi başarıyla gerçekleşti!');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, onClose]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Scrollbar sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Stack spacing={3}>
          <Field.Text name="title" label="Başlık" />

          <Field.Text name="description" label="Açıklama" multiline rows={3} />

          <Field.Switch name="allDay" label="Tüm Gün" />

          <LocalizationProvider 
            dateAdapter={AdapterDayjs} 
            adapterLocale="tr" 
            localeText={{
            cancelButtonLabel: "İptal",
            okButtonLabel: "Tamam",
            datePickerToolbarTitle: "Tarih ve Saat Seç",
            dateTimePickerToolbarTitle: "Tarih ve Saat Seç"
          }}>
            <Field.MobileDateTimePicker name="start" label="Başlangıç Tarihi" format="DD MMMM YYYY HH:mm" />
            <Field.MobileDateTimePicker 
              name="end" 
              label="Bitiş Tarihi" 
              format="DD MMMM YYYY HH:mm"
              slotProps={{
                textField: {
                  error: dateError,
                  helperText: dateError ? 'Bitiş tarihi başlangıç ​​tarihinden sonra olmalıdır!' : null,
                },
              }}
            />
          </LocalizationProvider>

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker
                value={field.value}
                onChange={(color) => field.onChange(color)}
                options={colorOptions}
              />
            )}
          />
        </Stack>
      </Scrollbar>

      <DialogActions sx={{ flexShrink: 0 }}>
        {!!currentEvent?.id && (
          <Tooltip title="Etkinliği Sil">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          İptal
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Kaydet
        </LoadingButton>
      </DialogActions>
    </Form>
  );
}
