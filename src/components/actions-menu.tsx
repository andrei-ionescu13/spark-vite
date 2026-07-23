import type { MenuItemProps, MenuProps } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import type { ElementType } from 'react';
import { Link } from 'react-router';

export interface ActionsItem extends MenuItemProps {
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  href?: string;
  icon: ElementType;
  label: string;
  onClick?: () => void;
}

interface IconActionMenuProps extends MenuProps {
  items: ActionsItem[];
  onClose: () => void;
}

export const ActionsMenu = ({
  items,
  onClose,
  ...rest
}: IconActionMenuProps) => {
  return (
    <Menu
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...rest}
    >
      {items.map(({ label, icon: Icon, onClick, color, href, disabled }) =>
        href ? (
          <MenuItem
            component={Link}
            to={href}
            key={label}
            sx={{
              color,
              fontWeight: 500,
              gap: 1,
            }}
          >
            <Icon sx={{ mr: 1 }} />
            {label}
          </MenuItem>
        ) : (
          <MenuItem
            disabled={disabled}
            onClick={() => {
              onClick && onClick();
              onClose();
            }}
            key={label}
            sx={{
              color,
              fontWeight: 500,
              gap: 1,
            }}
          >
            <Icon sx={{ mr: 1 }} />
            {label}
          </MenuItem>
        )
      )}
    </Menu>
  );
};
