import { IconButton } from '@mui/material';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ActionsItem } from './actions-menu';
import { ActionsMenu } from './actions-menu';

interface ActionsIconButtonProps {
  items: ActionsItem[];
  onClose?: () => void;
  onOpen?: () => void;
}

export const ActionsIconButton = ({
  items,
  onOpen,
  onClose,
}: ActionsIconButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    if (onOpen) {
      onOpen();
    }

    setOpen(true);
  };

  const handleClose = (): void => {
    if (onClose) {
      onClose();
    }

    setOpen(false);
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleOpen}
        ref={buttonRef}
      >
        <EllipsisVerticalIcon />
      </IconButton>
      <ActionsMenu
        items={items}
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
      />
    </>
  );
};
