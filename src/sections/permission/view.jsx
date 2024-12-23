import { useState, useCallback } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function PermissionDeniedView() {
  const [role, setRole] = useState('admin');

  const handleChangeRole = useCallback((event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Permission"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Permission' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ToggleButtonGroup
        exclusive
        value={role}
        size="small"
        onChange={handleChangeRole}
        sx={{ mb: 5, alignSelf: 'center' }}
      >
        <ToggleButton value="admin" aria-label="Admin role">
          Admin role
        </ToggleButton>
        <ToggleButton value="user" aria-label="User role">
          User role
        </ToggleButton>
      </ToggleButtonGroup>
    </DashboardContent>
  );
}
