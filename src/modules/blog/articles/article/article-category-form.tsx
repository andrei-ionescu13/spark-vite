import { Button } from '@/components/button';
import type { ArticleCategory } from '@/types/article-category';
import type { Article } from '@/types/articles';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, Grid, MenuItem, Select } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useUpdateArticleCategory } from './api';

interface ArticleCategoryFormProps {
  article: Article;
  categories: ArticleCategory[];
  isEditDisabled?: boolean;
}

interface Category {
  label: string;
  value: string;
}

export const ArticleCategoryForm = ({
  article,
  categories,
  isEditDisabled,
}: ArticleCategoryFormProps) => {
  const queryClient = useQueryClient();

  if (!article || !categories) return null;

  const updateArticleCategory = useUpdateArticleCategory(article._id);

  const categoryOptions: Category[] = categories?.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const schema = z.object({
    category: z.enum(categoryOptions.map((category) => category.value)),
  });

  type FormData = z.infer<typeof schema>;

  const { handleSubmit, control, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      category: article.category._id,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ category }) => {
    updateArticleCategory.mutate(category, {
      onSuccess: ({ category }) => {
        queryClient.setQueryData(['articles', article._id], {
          ...article,
          category,
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
        size={12}
        sx={{
          display: 'grid',
          gridTemplateColumns: '9fr 3fr',
          gap: 1,
        }}
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => {
            return (
              <FormControl
                fullWidth
                size="small"
              >
                <Select
                  id="category"
                  {...field}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem
                      value={category.value}
                      key={category.value}
                    >
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }}
        />

        <Button
          color="primary"
          disabled={
            isEditDisabled || watch('category') === article.category._id
          }
          isLoading={updateArticleCategory.isPending}
          variant="contained"
          type="submit"
        >
          Update
        </Button>
      </Grid>
    </form>
  );
};
