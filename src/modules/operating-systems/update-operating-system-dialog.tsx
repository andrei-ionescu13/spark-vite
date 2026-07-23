import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import type { AlertDialogProps } from '../../components/alert-dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { TextInput } from '../../components/text-input';
import type { OperatingSystem } from '../../types/operating-sistem';
import { useUpdateOperatingSystem } from './api';

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      OperatingSystem updated
    </Typography>
  </Box>
);

const schema = z.object({
  name: z.string().max(255),
  slug: z.string().max(255),
});

type FormData = z.infer<typeof schema>;

interface OperatingSystemDuplicateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  operatingSystem: OperatingSystem;
}

export const OperatingSystemUpdateDialog = ({
  onClose,
  operatingSystem,
  ...rest
}: OperatingSystemDuplicateDialogProps) => {
  const queryClient = useQueryClient();
  const updateOperatingSystem = useUpdateOperatingSystem(
    operatingSystem._id,
    () => queryClient.invalidateQueries({ queryKey: ['operatingSystems'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: operatingSystem.name,
      slug: operatingSystem.slug,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    updateOperatingSystem.mutate(values, {
      onSuccess: ({ name }) => {
        onClose();
        toast.success(ToastSuccess(name));
      },
    });
  };

  return (
    <AlertDialog
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      title={`Update OS`}
      isLoading={updateOperatingSystem.isPending}
      {...rest}
    >
      <Grid
        container
        spacing={3}
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
          <Controller
            name="slug"
            control={control}
            render={({ field }) => {
              return (
                <TextInput
                  {...field}
                  info="If a slug is not provided, one will be generated"
                  error={!!errors.slug}
                  helperText={errors.slug?.message}
                  fullWidth
                  id="slug"
                  label="Slug"
                  size="small"
                />
              );
            }}
          />
        </Grid>
        {updateOperatingSystem.isError && (
          <Grid size={12}>
            <FormHelperText error>
              {updateOperatingSystem.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
