import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { CONFIG } from 'src/global-config';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: 'Lütfen yorum yazınız!' }),
});

// ----------------------------------------------------------------------

export function PostCommentForm( {id} ) {
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
      const response = await fetch(`${CONFIG.apiUrl}/Task/add-task-comment?taskId=${id}&comment=${data.comment}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Yorum eklenirken hata oluştu!");
      }
  
      const result = await response.json();
      toast.success("Yorum başarıyla eklendi!");
      setTimeout(() => {
        window.location.href = `/dashboard/kanban/${id}`;
      }, 1000);
    } catch (error) {
      console.error("Hata:", error);
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
