import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { schemas } from '@/schemas';
import type { Article } from '@/types/articles';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { listTags } from '../../tags/api';
import { useUpdateArticleTags } from './api';

const schema = z.object({
  tags: z.array(schemas.tag).min(1),
});

type FormData = z.infer<typeof schema>;

interface ArticleTagsFormProps {
  article: Article;
  onClose: any;
  open: boolean;
}

export const ArticleTagsForm = ({
  open,
  onClose,
  article,
}: ArticleTagsFormProps) => {
  const { data: tags, isLoading } = useQuery({
    queryKey: ['article-tags'],
    queryFn: listTags,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      tags: article.tags,
    },
  });

  const updateArticleTags = useUpdateArticleTags(article._id);
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async ({ tags }) => {
    setSubmitError(null);
    const formValues = {
      tags: tags.map((tag) => tag._id),
    };
    updateArticleTags.mutate(formValues, {
      onSuccess: (data) => {
        queryClient.setQueryData(['articles', article._id], {
          ...article,
          ...data,
        });
        onClose();
      },
      onError: (error) => {
        setSubmitError(error.message);
      },
    });
  };

  const articleTagIds = watch('tags').map((tag) => tag._id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update Tags</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              {isLoading || !tags ? null : (
                <Controller
                  name="tags"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => {
                    return (
                      <Autocomplete
                        autoHighlight
                        value={value}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.name}
                        id="tags"
                        multiple
                        onChange={(event: SyntheticEvent, newValue) => {
                          onChange(newValue);
                        }}
                        options={tags.filter(
                          (option) => !articleTagIds.includes(option._id)
                        )}
                        renderInput={(params) => (
                          <TextInput
                            {...params}
                            {...rest}
                            label="Tags"
                            name="tags"
                            error={!!errors.tags}
                            helperText={errors.tags?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
              )}
            </Grid>
          </Grid>
          {!!submitError && (
            <FormHelperText
              error
              sx={{ mt: 1 }}
            >
              {submitError}
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={onClose}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={updateArticleTags.isPending}
            variant="contained"
            type="submit"
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
