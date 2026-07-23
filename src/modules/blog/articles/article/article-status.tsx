import { Button } from '@/components/button';
import { StatusSelect, type StatusOption } from '@/components/status';
import type { Article } from '@/types/articles';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors, FormControl, Grid, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useUpdateArticleStatus } from './api';

interface ArticleStatusCategoryProps {
  article: Article;
}

export const ArticleStatus = ({ article }: ArticleStatusCategoryProps) => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  if (!article) return null;

  const updateArticleStatus = useUpdateArticleStatus(article._id);

  const statusOptions: StatusOption[] = [
    {
      label: 'Published',
      value: 'published',
      color: theme.palette.success.main,
    },
    {
      label: 'Draft',
      value: 'draft',
      color: colors.grey[500],
    },
    {
      label: 'Archived',
      value: 'archived',
      color: theme.palette.error.main,
    },
  ];

  const schema = z.object({
    status: z.enum(statusOptions.map((status) => status.value)),
  });

  type FormData = z.infer<typeof schema>;

  const { handleSubmit, control, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      status: article.status,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ status }) => {
    updateArticleStatus.mutate(status, {
      onSuccess: ({ status }) => {
        queryClient.setQueryData(['articles', article._id], {
          ...article,
          status,
        });
        toast.success('Article updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          size={12}
          sx={{
            display: 'grid',
            gridTemplateColumns: '9fr 3fr',
            gap: 1,
          }}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              return (
                <FormControl
                  fullWidth
                  size="small"
                >
                  <StatusSelect
                    {...field}
                    id="status"
                    options={statusOptions}
                  />
                </FormControl>
              );
            }}
          />

          <Button
            color="primary"
            variant="contained"
            isLoading={updateArticleStatus.isPending}
            disabled={watch('status') === article.status}
            type="submit"
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
