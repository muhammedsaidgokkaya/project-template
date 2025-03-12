import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { Field } from 'src/components/hook-form';

export function PostCommentItem({ name, avatarUrl, message, tagUser, postedAt, hasReply }) {
  const reply = useBoolean();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Burada düzenlenen yorumu kaydetme işlemi yapılabilir
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedMessage(message);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        pt: 3,
        display: 'flex',
        position: 'relative',
        ...(hasReply && { pl: 8 }),
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ mr: 2, width: 48, height: 48 }} />

      <Stack
        flexGrow={1}
        sx={[(theme) => ({ pb: 3, borderBottom: `solid 1px ${theme.vars.palette.divider}` })]}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDate(postedAt)}
        </Typography>

        {/* {isEditing ? (
          <Field.Editor
            fullWidth
            autoFocus
            value={editedMessage}
            onChange={setEditedMessage}
            sx={{ mt: 1 }}
          />
        ) : ( */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            {tagUser && (
              <Box component="strong" sx={{ mr: 0.5 }}>
                @{tagUser}
              </Box>
            )}
            <Markdown children={message} />
          </Typography>
        {/* )} */}
      </Stack>

      {/* {isEditing ? (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button size="small" color="primary" onClick={handleSaveClick}>
            Kaydet
          </Button>
          <Button size="small" color="inherit" onClick={handleCancelClick}>
            İptal
          </Button>
        </Stack>
      ) : (
        <Button
          size="small"
          color="inherit"
          startIcon={<Iconify icon="solar:pen-bold" width={16} />}
          onClick={handleEditClick}
        >
          Düzenle
        </Button>
      )} */}
    </Box>
  );
}
