import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LucideProvider } from 'lucide-react';
import { RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ThemeDrawer } from './components/theme-drawer';
import { router } from './routes';
import { useSettings } from './store/settings';
import { createCustomTheme } from './theme';

const queryClient = new QueryClient();

export const App = () => {
  const { theme, preset } = useSettings();
  const muiTheme = createCustomTheme(theme, preset);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={muiTheme}>
        <LucideProvider size={20}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeDrawer />
            <CssBaseline />
            <ToastContainer
              theme={'dark'}
              closeOnClick={false}
              pauseOnHover={false}
            />
            <RouterProvider router={router} />
          </LocalizationProvider>
        </LucideProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
