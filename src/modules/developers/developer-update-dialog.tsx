import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import type { AlertDialogProps } from '../../components/alert-dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { TextInput } from '../../components/text-input';
import type { Developer } from '../../types/developer';
import { useUpdateDeveloper } from './api';

const schema = z.object({
  name: z.string(),
  slug: z.string(),
});

type FormData = z.infer<typeof schema>;

interface DeveloperDuplicateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  developer: Developer;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Developer updated
    </Typography>
  </Box>
);

export const DeveloperUpdateDialog = ({
  onClose,
  developer,
  ...rest
}: DeveloperDuplicateDialogProps) => {
  const queryClient = useQueryClient();
  const updateDeveloper = useUpdateDeveloper(developer._id, () =>
    queryClient.invalidateQueries({ queryKey: ['developers'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: developer.name,
      slug: developer.slug,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    updateDeveloper.mutate(values, {
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
      title={'Update developer'}
      isLoading={updateDeveloper.isPending}
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
                  label="Name"
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
                />
              );
            }}
          />
        </Grid>
        {updateDeveloper.isError && (
          <Grid size={12}>
            <FormHelperText error>
              {updateDeveloper.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
