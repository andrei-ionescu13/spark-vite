import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import type { Platform } from '@/types/platforms';
import { isString } from '@/utils/is-string';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { ImageUpdate } from '../../components/image-update';
import { buildFormData } from '../../utils/build-form-data';
import { useUpdatePlatform } from './api';

const schema = z.object({
  name: z.string().max(255),
  logo: z.union([z.file(), z.string()]),
});

type FormData = z.infer<typeof schema>;

interface UpdatePlatformDialogProps {
  open: boolean;
  onClose: any;
  platform: Platform;
}

export const UpdatePlatformDialog = ({
  open,
  onClose,
  platform,
}: UpdatePlatformDialogProps) => {
  const queryClient = useQueryClient();

  const updatePlatform = useUpdatePlatform(() =>
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  );

  const handleUpdatePlatform = (formData: any) => {
    updatePlatform.mutate(
      { id: platform._id, body: formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: platform.name,
      logo: platform.logo.url,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    const formData = buildFormData(values);
    handleUpdatePlatform(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {' '}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update platform</DialogTitle>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => {
                  return (
                    <TextInput
                      {...field}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      id="name"
                      label="Publisher"
                      size="small"
                    />
                  );
                }}
              />
            </Grid>
            <Grid size={12}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Logo
              </Typography>
              <Controller
                name="logo"
                control={control}
                render={({ field: { value, onChange, name } }) => {
                  return (
                    <ImageUpdate
                      name={name}
                      url={isString(value) ? value : ''}
                      alt=""
                      onFileSelect={(file: any) => {
                        onChange(file);
                      }}
                    />
                  );
                }}
              />

              {!!errors.logo?.message && (
                <FormHelperText error>{errors.logo?.message}</FormHelperText>
              )}
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
            isLoading={updatePlatform.isPending}
            type="submit"
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
