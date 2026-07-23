import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import type { AlertDialogProps } from '../../components/alert-dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { TextInput } from '../../components/text-input';
import { useCreateOperatingSystem } from './api';

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      OperatingSystem created
    </Typography>
  </Box>
);

const schema = z.object({
  name: z.string().max(255),
  slug: z.string().max(255).optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateOperatingSystemDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {}

export const CreateOperatingSystemDialog = ({
  onClose,
  ...rest
}: CreateOperatingSystemDialogProps) => {
  const queryClient = useQueryClient();
  const createOperatingSystem = useCreateOperatingSystem(() =>
    queryClient.invalidateQueries({ queryKey: ['operatingSystems'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    createOperatingSystem.mutate(values, {
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
      title={`Create Operating System`}
      isLoading={createOperatingSystem.isPending}
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
        {createOperatingSystem.error?.message && (
          <Grid size={12}>
            <FormHelperText error>
              {createOperatingSystem.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
