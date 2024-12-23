import { lazy, Suspense } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthCenteredLayout } from 'src/layouts/auth-centered';
import { SplashScreen } from 'src/components/loading-screen';

import { loginRoutes } from './login';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

const LoginPage = lazy(() => import('src/pages/login'));
const HomePage = lazy(() => import('src/pages/dashboard'));
const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <AuthCenteredLayout>
          <LoginPage />
        </AuthCenteredLayout>
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <DashboardLayout>
          <HomePage />
        </DashboardLayout>
      </Suspense>
    ),
  },

  // Login
  ...loginRoutes,
  
  // Dashboard
  ...dashboardRoutes,

  // Components
  ...componentsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
