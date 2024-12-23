import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, sx, ...other }) {

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
  };

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      sx={sx}
      onClick={handleLogout}
      {...other}
    >
      Çıkış yap
    </Button>
  );
}
