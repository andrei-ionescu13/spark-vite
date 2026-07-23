import { AlertDialog, type AlertDialogProps } from '@/components/alert-dialog';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Link, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useCreateArticleTag } from './api';

const schema = z.object({
  name: z.string(),
  slug: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TagCreateDialog
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Article duplicated
    </Typography>
    <Link
      color="textPrimary"
      href={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

export const TagCreateDialog = ({ onClose, ...rest }: TagCreateDialog) => {
  const queryClient = useQueryClient();
  const createArticleTag = useCreateArticleTag(() =>
    queryClient.invalidateQueries({ queryKey: ['article-tags'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    createArticleTag.mutate(values, {
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
      title={`Duplicate article`}
      isLoading={createArticleTag.isPending}
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
                  info="If a slug is not provided, one will be generated"
                />
              );
            }}
          />
        </Grid>
        {createArticleTag.error?.message && (
          <Grid size={12}>
            <FormHelperText error>
              {createArticleTag.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
