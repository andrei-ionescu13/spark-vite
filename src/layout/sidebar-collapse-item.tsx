import type { ButtonProps } from '@mui/material';
import { Button, styled } from '@mui/material';
import type { ElementType } from 'react';

interface SidebarCollapseItemProps extends ButtonProps {
  component?: ElementType;
}

const SidebarCollapseItemRoot = styled(Button)(({ theme }) => ({
  fontWeight: 'normal',
  justifyContent: 'flex-start',
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  '&:hover': {
    backgroundColor: 'rgba(145, 158, 171, 0.12)',
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

export const SidebarListItem = (props: SidebarCollapseItemProps) => {
  return (
    <SidebarCollapseItemRoot
      fullWidth
      {...props}
    />
  );
};
