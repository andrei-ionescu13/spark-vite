import type { DialogProps } from '@mui/material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Button } from '../../components/button';
import { exportKeys } from './api';

interface AlertDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
}

export const KeysExportDialog = ({
  open,
  onClose,
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
      <DialogTitle>Export keys</DialogTitle>
      <DialogContent
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <DialogContentText sx={{ mb: 1 }}>Select the format</DialogContentText>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gap: 2,
          }}
        >
          <Button
            color="primary"
            variant="text"
            onClick={() => {
              exportKeys();
            }}
          >
            JSON
          </Button>
          <Button
            color="primary"
            variant="text"
          >
            CSV
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
