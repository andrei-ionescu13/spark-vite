import type { DialogProps } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { ReactNode, SubmitEventHandler } from 'react';
import { Button } from './button';

export interface AlertDialogProps extends Omit<DialogProps, 'onSubmit'> {
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitEventHandler<unknown>;
  title: string;
  content?: string;
  isLoading: boolean;
  children?: ReactNode;
}

export const AlertDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  content,
  children,
  isLoading,
  ...rest
}: AlertDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      {...rest}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content && <DialogContentText>{content}</DialogContentText>}
          {children}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={onClose}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            autoFocus
            color="primary"
            isLoading={isLoading}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
