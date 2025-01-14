import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { AuthCenteredLayout } from 'src/layouts/auth-centered';
import { RegisterCenteredLayout } from 'src/layouts/register';
import { ConnectCenteredLayout } from 'src/layouts/connects';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// Login
const LoginPage = lazy(() => import('src/pages/login'));
const RegisterPage = lazy(() => import('src/pages/register'));
const ConnectPage = lazy(() => import('src/pages/connect'));
const AccountSettingPage = lazy(() => import('src/pages/account-setting'));
const GooglePage = lazy(() => import('src/pages/call-back/google'));
const MetaPage = lazy(() => import('src/pages/call-back/meta'));

// ----------------------------------------------------------------------
const loginLayout = () => (
  <AuthCenteredLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AuthCenteredLayout>
);

const registerLayout = () => (
  <RegisterCenteredLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </RegisterCenteredLayout>
);

const connectLayout = () => (
  <ConnectCenteredLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </ConnectCenteredLayout>
);

export const loginRoutes = [
  {
    path: 'login',
    element: loginLayout(),
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
  {
    path: 'register',
    element: registerLayout(),
    children: [
      { index: true, element: <RegisterPage /> },
    ],
  },
  {
    path: 'connect',
    element: connectLayout(),
    children: [
      { index: true, element: <ConnectPage /> },
    ],
  },
  {
    path: 'account-setting',
    element: connectLayout(),
    children: [
      { index: true, element: <AccountSettingPage /> },
    ],
  },
  {
    path: 'call-back-google',
    element: connectLayout(),
    children: [
      { index: true, element: <GooglePage /> },
    ],
  },
  {
    path: 'call-back-meta',
    element: connectLayout(),
    children: [
      { index: true, element: <MetaPage /> },
    ],
  },
];
