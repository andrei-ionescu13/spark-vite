import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  useTheme,
} from '@mui/material';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../components/button';
import type { StatusOption } from '../../components/status';
import { StatusSelect } from '../../components/status';
import type { Key } from '../../types/keys';
import { useUpdateKeyStatus } from '../products/api';

interface KeysUpdateDialogProps {
  open: boolean;
  onClose: any;
  productKey: Key;
  refetch: () => Promise<any>;
}

export const KeysUpdateDialog = ({
  open,
  onClose,
  productKey,
  refetch,
}: KeysUpdateDialogProps) => {
  const theme = useTheme();
  const updateKeyStatus = useUpdateKeyStatus(productKey._id);

  const statusOptions: StatusOption[] = [
    {
      label: 'Secret',
      value: 'secret',
      color: theme.palette.info.main,
    },
    {
      label: 'Revealed',
      value: 'revealed',
      color: theme.palette.success.main,
    },
    {
      label: 'Reported',
      value: 'reported',
      color: theme.palette.error.main,
    },
  ];

  const schema = z.object({
    status: z.enum(statusOptions.map((option) => option.value)),
  });

  type FormData = z.infer<typeof schema>;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: productKey.status,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ status }) => {
    updateKeyStatus.mutate(status, {
      onSuccess: async () => {
        await refetch();
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update status</DialogTitle>{' '}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl
                    error={!!errors.status}
                    fullWidth
                    size="small"
                  >
                    <StatusSelect
                      {...field}
                      id="status"
                      options={statusOptions}
                    />
                    {!!errors.status?.message && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={updateKeyStatus.isPending}
            type="submit"
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
