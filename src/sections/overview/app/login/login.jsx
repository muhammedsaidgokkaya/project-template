import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField  from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function LoginAppView() {
  const showPassword = useBoolean();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('https://localhost:44327/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('jwtToken', data.token);
      window.location.href = '/dashboard';
    } else {
      alert('Giriş başarısız!');
    }
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <TextField label="Kullanıcı adı" placeholder="" value={username} slotProps={{ inputLabel: { shrink: true } }} onChange={(e) => setUsername(e.target.value)} />

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
          onChange={(e) => setPassword(e.target.value)}
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
        />
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        loadingIndicator="Giriş Yap..."
        onClick={handleLogin}
      >
        Giriş Yap
      </Button>
    </Box>
  );

  return (
    <>
        {renderForm()}
    </>
  );
}
