import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField  from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { CONFIG } from 'src/global-config';
import { RouterLink } from 'src/routes/components';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';

// ----------------------------------------------------------------------

export function LoginAppView() {
  const showPassword = useBoolean();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    if (!username || !password) {
      setErrors({
        username: username ? '' : 'Kullanıcı adı boş olamaz',
        password: password ? '' : 'Şifre boş olamaz',
      });
      return;
    }

    try {
      const response = await axios.post(`${CONFIG.apiUrl}/auth/login`, {
        username,
        password,
      });

      if (response.data.isSuccess) {
        localStorage.setItem('jwtToken', response.data.token);
        window.location.href = '/dashboard';
      } else {
        toast.error("Kullanıcı adı veya şifre yanlış!");
      }
    } catch (error) {
      toast.error("Kullanıcı adı veya şifre yanlış!");
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: '',
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Giriş Yap
      </Typography>
      <TextField
        label="Kullanıcı adı"
        placeholder=""
        value={username}
        error={!!errors.username}
        helperText={errors.username}
        onChange={handleUsernameChange}
        onKeyDown={handleKeyDown}
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Şifremi unuttum
        </Link>

        <TextField
          label="Şifre"
          value={password}
          error={!!errors.password}
          helperText={errors.password}
          onChange={handlePasswordChange}
          placeholder=""
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          onKeyDown={handleKeyDown}
        />
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        onClick={handleLogin}
      >
        Giriş Yap
      </Button>
    </Box>
  );

  return renderForm();
}
