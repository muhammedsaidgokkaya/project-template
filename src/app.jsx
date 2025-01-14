import 'src/global.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { LocalizationProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

export default function App({ children }) {
  useScrollToTop();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const currentPath = window.location.pathname;

    if (['/register', '/call-back-meta', '/call-back-google'].includes(currentPath)) {
      return;
    }

    if (!token) {
      handleUnauthenticated('/login');
      return;
    }

    const validateToken = async () => {
      try {
        await validateUserToken(token);
        await validateThirdPartyTokens(token);
        await validateOrganization(token);
        setIsAuthenticated(true);
      } catch (error) {
        handleUnauthenticated(error.redirectPath || '/login');
      }
    };

    validateToken();
  }, [navigate]);

  const handleUnauthenticated = (path) => {
    setIsAuthenticated(false);
    navigate(path);
  };

  const validateUserToken = async (token) => {
    const url = `${CONFIG.apiUrl}/Auth/control`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const userId = await response.json();
    if (userId === 0) throw { redirectPath: '/login' };
  };

  const validateThirdPartyTokens = async (token) => {
    const metaControlUrl = `${CONFIG.apiUrl}/Auth/meta-token-control`;
    const googleControlUrl = `${CONFIG.apiUrl}/Auth/google-token-control`;

    const [metaResponse, googleResponse] = await Promise.all([
      fetch(metaControlUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
      fetch(googleControlUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
    ]);

    const [metaResult, googleResult] = await Promise.all([metaResponse.json(), googleResponse.json()]);

    if (metaResult === 0 || googleResult === 0) throw { redirectPath: '/connect' };
  };

  const validateOrganization = async (token) => {
    const url = `${CONFIG.apiUrl}/Auth/organization-control`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result === 0) throw { redirectPath: '/account-setting' };
  };

  return (
    <I18nProvider>
      <SettingsProvider defaultSettings={defaultSettings}>
        <LocalizationProvider>
          <ThemeProvider
            noSsr
            defaultMode={themeConfig.defaultMode}
            modeStorageKey={themeConfig.modeStorageKey}
          >
            <MotionLazy>
              <CheckoutProvider>
                <Snackbar />
                <ProgressBar />
                <SettingsDrawer defaultSettings={defaultSettings} />
                {children}
              </CheckoutProvider>
            </MotionLazy>
          </ThemeProvider>
        </LocalizationProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
