import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import type { AlertDialogProps } from '../../components/alert-dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { TextInput } from '../../components/text-input';
import type { Feature } from '../../types/feature';
import { useUpdateFeature } from './api';

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Feature updated
    </Typography>
  </Box>
);

const schema = z.object({
  name: z.string(),
  slug: z.string(),
});

type FormData = z.infer<typeof schema>;

interface FeatureDuplicateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  feature: Feature;
}

export const FeatureUpdateDialog = ({
  onClose,
  feature,
  ...rest
}: FeatureDuplicateDialogProps) => {
  const queryClient = useQueryClient();
  const updateFeature = useUpdateFeature(feature._id, () =>
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
    updateFeature.mutate(values, {
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
      title={`Update feature`}
      isLoading={updateFeature.isPending}
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
        {updateFeature.isError && (
          <Grid size={12}>
            <FormHelperText error>
              {updateFeature.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
