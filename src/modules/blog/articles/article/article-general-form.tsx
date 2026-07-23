import { Button } from '@/components/button';
import { ImageUpdate } from '@/components/image-update';
import { TextInput } from '@/components/text-input';
import type { Article } from '@/types/articles';
import { buildFormData } from '@/utils/build-form-data';
import { isString } from '@/utils/is-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Card, CardContent, FormHelperText, Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useUpdateArticleGeneral } from './api';

const schema = z.object({
  description: z.string(),
  title: z.string(),
  slug: z.string(),
  markdown: z.string(),
  cover: z.union([z.instanceof(File), z.string()]),
});

type FormData = z.infer<typeof schema>;

interface ArticleGeneralFormProps {
  article: Article;
  onClose: any;
}

export const ArticleGeneralForm = ({
  article,
  onClose,
}: ArticleGeneralFormProps) => {
  const queryClient = useQueryClient();
  const updateArticleDetails = useUpdateArticleGeneral(article._id);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      description: article.description,
      title: article.title,
      markdown: article.markdown,
      cover: article.cover.url,
      slug: article.slug,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    clearErrors('root.serverError');
    const formData = buildFormData(values);

    updateArticleDetails.mutate(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(['articles', article._id], {
          ...article,
          ...data,
        });
        onClose();
      },
      onError: (error) => {
        setError('root.serverError', {
          type: 'server',
          message: error.message,
        });
      },
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={2}
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
              <Grid size={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        id="description"
                        label="Description"
                        minRows={4}
                        multiline
                        size="small"
                        fullWidth
                      />
                    );
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="markdown"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.markdown}
                        helperText={errors.markdown?.message}
                        id="markdown"
                        label="Content"
                        maxRows={12}
                        minRows={6}
                        multiline
                        size="small"
                        fullWidth
                      />
                    );
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="cover"
                  control={control}
                  render={({ field: { value, onChange, name } }) => {
                    return (
                      <ImageUpdate
                        name={name}
                        url={isString(value) ? value : ''}
                        alt=""
                        onFileSelect={(file: any) => {
                          onChange(file);
                        }}
                      />
                    );
                  }}
                />

                {!!errors.cover?.message && (
                  <FormHelperText error>{errors.cover?.message}</FormHelperText>
                )}
              </Grid>
            </Grid>
            {!!errors.root?.serverError && (
              <FormHelperText
                error
                sx={{ mt: 1 }}
              >
                {errors.root.serverError.message}
              </FormHelperText>
            )}
          </CardContent>
        </Card>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            color="secondary"
            onClick={onClose}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={updateArticleDetails.isPending}
            type="submit"
            variant="contained"
          >
            Update
          </Button>
        </Box>
      </form>
    </Box>
  );
};
