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
    }else if(!token) {
      setIsAuthenticated(false);
      navigate('/login');
      return;
    }
  
    const fetchData = async () => {
      try {
        const url = `${CONFIG.apiUrl}/Auth/control`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const userId = await response.json();
  
        if (userId === 0) {
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          const controlMetaUrl = `${CONFIG.apiUrl}/Auth/meta-token-control`;
          const tokenMetaControl = await fetch(controlMetaUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const tokenMetaControlResult = await tokenMetaControl.json();

          const controlGoogleUrl = `${CONFIG.apiUrl}/Auth/google-token-control`;
          const tokenGoogleControl = await fetch(controlGoogleUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const tokenGoogleControlResult = await tokenGoogleControl.json();

        if (tokenMetaControlResult === 0 || tokenGoogleControlResult === 0) {
          setIsAuthenticated(false);
          navigate('/connect');
        } else {
          setIsAuthenticated(true);
        }
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/login');
      }
    };
  
    fetchData();
  }, [navigate]);

  if (!isAuthenticated) {
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
