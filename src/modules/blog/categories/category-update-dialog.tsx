import { AlertDialog, type AlertDialogProps } from '@/components/alert-dialog';
import { Link } from '@/components/link';
import { TextInput } from '@/components/text-input';
import type { ArticleCategory } from '@/types/article-category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useUpdateArticleCategory } from './api';

const schema = z.object({
  name: z.string(),
  slug: z.string(),
});

type FormData = z.infer<typeof schema>;

interface CategoryUpdateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  articleCategory: ArticleCategory;
}

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
      to={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

export const CategoryUpdateDialog = ({
  onClose,
  articleCategory,
  ...rest
}: CategoryUpdateDialogProps) => {
  const queryClient = useQueryClient();
  const createArticleCategory = useUpdateArticleCategory(
    articleCategory._id,
    () => queryClient.invalidateQueries({ queryKey: ['article-categories'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: articleCategory.name,
      slug: articleCategory.slug,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    createArticleCategory.mutate(values, {
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
      title={`Update article category`}
      isLoading={createArticleCategory.isPending}
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
        {createArticleCategory.isError && (
          <Grid size={12}>
            <FormHelperText error>
              {createArticleCategory.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
