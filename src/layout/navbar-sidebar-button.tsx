import { useLayout } from '@/layout-context';
import { IconButton } from '@mui/material';
import { MenuIcon } from 'lucide-react';

export const NavbarSidebarButton = () => {
  const { handleSidebarOpen } = useLayout();

  return (
    <IconButton
      onClick={handleSidebarOpen}
      sx={{
        display: {
          sx: 'inline-flex',
          lg: 'none',
        },
      }}
    >
      <MenuIcon />
    </IconButton>
  );
};
