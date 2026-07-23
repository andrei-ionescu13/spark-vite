import { useAuth } from '@/contexts/auth-context';
import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router';
import { LayoutProvider } from '../layout-context';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export const DashboardLayout = () => {
  const { admin } = useAuth();

  if (!admin) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <LayoutProvider>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          scrollbarGutter: 'stable',
          overflow: 'auto',
        }}
      >
        <Sidebar admin={admin} />
        <Navbar />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            pt: 8,
            background: 'background.default',
            height: '100%',
            width: '100%',
            pl: {
              lg: '270px',
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </LayoutProvider>
  );
};
