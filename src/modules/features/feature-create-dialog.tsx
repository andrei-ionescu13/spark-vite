import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import type { AlertDialogProps } from '../../components/alert-dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { TextInput } from '../../components/text-input';
import { useCreateFeature } from './api';

const ToastSuccess = () => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Feature created
    </Typography>
  </Box>
);

const schema = z.object({
  name: z.string(),
  slug: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface FeatureCreateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {}

export const FeatureCreateDialog = ({
  onClose,
  ...rest
}: FeatureCreateDialogProps) => {
  const queryClient = useQueryClient();
  const createFeature = useCreateFeature(() =>
    queryClient.invalidateQueries({ queryKey: ['features'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    createFeature.mutate(values, {
      onSuccess: () => {
        onClose();
        toast.success(ToastSuccess());
      },
    });
  };

  return (
    <AlertDialog
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      title={`Create feature`}
      isLoading={createFeature.isPending}
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
        {createFeature.error?.message && (
          <Grid size={12}>
            <FormHelperText error>
              {createFeature.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
