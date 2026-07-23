import { AlertDialog, type AlertDialogProps } from '@/components/alert-dialog';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useCreateGenre } from './api';

const schema = z.object({
  name: z.string().max(255),
  slug: z.string().max(255).optional(),
});

type FormData = z.infer<typeof schema>;

interface GenreCreateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {}

export const GenreCreateDialog = ({
  onClose,
  ...rest
}: GenreCreateDialogProps) => {
  const queryClient = useQueryClient();

  const createGenre = useCreateGenre(() =>
    queryClient.invalidateQueries({ queryKey: ['genres'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    createGenre.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      title={`Create Genre`}
      isLoading={createGenre.isPending}
      {...rest}
    >
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
      </Grid>
    </AlertDialog>
  );
};
