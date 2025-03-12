import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: 'Lütfen yorum yazınız!' }),
});

// ----------------------------------------------------------------------

export function PostCommentForm() {
  const defaultValues = {
    comment: '',
  };

  const methods = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Field.Editor name="comment" sx={{ maxHeight: 480 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          </Box>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Yorum Ekle
          </LoadingButton>
        </Box>
      </Box>
    </Form>
  );
}
