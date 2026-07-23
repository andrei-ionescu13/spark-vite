import { Button } from '@mui/material';
import { ChevronDownIcon } from 'lucide-react';
import { useId, useState } from 'react';
import type { ActionsItem } from './actions-menu';
import { ActionsMenu } from './actions-menu';

interface ActionsProps {
  items: ActionsItem[];
  onClose?: () => void;
  onOpen?: () => void;
  isLoading?: boolean;
}

export const Actions = ({ items, isLoading }: ActionsProps) => {
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id={buttonId}
        color="primary"
        variant="contained"
        onClick={handleClick}
        disabled={isLoading}
      >
        Actions
        <ChevronDownIcon />
      </Button>
      <ActionsMenu
        id={menuId}
        items={items}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
};
