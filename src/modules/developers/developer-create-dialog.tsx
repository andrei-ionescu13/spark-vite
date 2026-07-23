import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import {
  AlertDialog,
  type AlertDialogProps,
} from '../../components/alert-dialog';
import { TextInput } from '../../components/text-input';
import { useCreateDeveloper } from './api';

const ToastSuccess = () => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Developer created
    </Typography>
  </Box>
);

const schema = z.object({
  name: z.string(),
  slug: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface DeveloperCreateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {}

export const DeveloperCreateDialog = ({
  onClose,
  ...rest
}: DeveloperCreateDialogProps) => {
  const queryClient = useQueryClient();
  const createDeveloper = useCreateDeveloper(() =>
    queryClient.invalidateQueries({ queryKey: ['developers'] })
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
    createDeveloper.mutate(values, {
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
      title={`Create developer`}
      isLoading={createDeveloper.isPending}
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
        {createDeveloper.error?.message && (
          <Grid size={12}>
            <FormHelperText error>
              {createDeveloper.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
