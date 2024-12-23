import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { AuthCenteredLayout } from 'src/layouts/auth-centered';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// Login
const LoginPage = lazy(() => import('src/pages/login'));

// ----------------------------------------------------------------------
const loginLayout = () => (
  <AuthCenteredLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AuthCenteredLayout>
);

export const loginRoutes = [
  {
    path: 'login',
    element: loginLayout(),
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
];
