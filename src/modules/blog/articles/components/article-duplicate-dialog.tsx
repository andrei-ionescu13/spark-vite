import { AlertDialog, type AlertDialogProps } from '@/components/alert-dialog';
import { Link } from '@/components/link';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useDuplicateArticle } from '../articles/api';

const schema = z.object({
  title: z.string(),
  slug: z.string(),
});

type FormData = z.infer<typeof schema>;

interface ArticleDuplicateDialog
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  articleId: string;
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

export const ArticleDuplicateDialog = ({
  articleId,
  onClose,
  ...rest
}: ArticleDuplicateDialog) => {
  const queryClient = useQueryClient();
  const duplicateArticle = useDuplicateArticle(articleId, () =>
    queryClient.invalidateQueries({ queryKey: ['articles'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    duplicateArticle.mutate(values, {
      onSuccess: ({ id }) => {
        onClose();
        toast.success(ToastSuccess(id));
      },
    });
  };

  return (
    <AlertDialog
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      title={`Duplicate article`}
      isLoading={duplicateArticle.isPending}
      {...rest}
    >
      <Grid
        container
        spacing={3}
      >
        <Grid size={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => {
              return (
                <TextInput
                  {...field}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  id="title"
                  label="Title"
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
        {duplicateArticle.error?.message && (
          <Grid size={12}>
            <FormHelperText error>
              {duplicateArticle.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
