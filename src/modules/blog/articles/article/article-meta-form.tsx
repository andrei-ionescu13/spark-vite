import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import type { Article } from '@/types/articles';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormHelperText,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useUpdateArticleMeta } from './api';

const schema = z.object({
  description: z.string(),
  keywords: z.array(z.string()),
  title: z.string(),
});

type FormData = z.infer<typeof schema>;

interface ArticleMetaFormProps {
  article: Article;
  onClose: any;
}

const metaKeywordOptions = ['Games', 'News', 'Reviews'];

export const ArticleMetaForm = ({ onClose, article }: ArticleMetaFormProps) => {
  const updateArticleMeta = useUpdateArticleMeta(article._id);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: article.meta.description,
      keywords: article.meta.keywords,
      title: article.meta.title,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    clearErrors('root.serverError');
    updateArticleMeta.mutate(values, {
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
                  name="description"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        id="description"
                        label="Description"
                        minRows={4}
                        multiline
                        name="description"
                        size="small"
                      />
                    );
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="keywords"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        filterSelectedOptions
                        freeSolo
                        getOptionLabel={(option) => option}
                        id="keywords"
                        multiple
                        onChange={(
                          event: SyntheticEvent,
                          newValue: string[]
                        ) => {
                          field.onChange(newValue);
                        }}
                        options={metaKeywordOptions}
                        value={field.value}
                        renderInput={(params) => (
                          <TextInput
                            {...params}
                            size="small"
                            label="Keywords"
                            name="keywords"
                            onBlur={field.onBlur}
                            error={!!errors.keywords}
                            helperText={errors.keywords?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
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
            isLoading={updateArticleMeta.isPending}
            variant="contained"
            type="submit"
          >
            Update
          </Button>
        </Box>
      </form>
    </Box>
  );
};
