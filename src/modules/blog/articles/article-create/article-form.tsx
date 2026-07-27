import { MarkdownPreview } from '@/components/markdown-preview';
import { schemas } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Card,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch,
} from '@mui/material';
import type { SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { Button } from '../../../../components/button';
import { ImageDropzone } from '../../../../components/image-dropzone';
import { TextInput } from '../../../../components/text-input';
import { ToastItemCreated } from '../../../../components/toast-item-created';
import { useDialog } from '../../../../hooks/useDialog';
import { buildFormData } from '../../../../utils/build-form-data';
import { useListArticleCategories, useListArticleTags } from '../../api';
import { useCreateArticle } from './api';

interface Option {
  label: string;
  value: string;
}

const metaKeywordOptions = ['Games', 'News'];

export const ArticleForm = () => {
  const createArticle = useCreateArticle();
  const updateArticle = useCreateArticle();
  const [openPreview, handleOpenPreview, handleClosePreview] = useDialog(false);
  const { data: categories, isLoading: categoriesIsLoaing } =
    useListArticleCategories();
  const { data: tags, isLoading: tagsIsLoading } = useListArticleTags();
  const dataIsLoading = categoriesIsLoaing || tagsIsLoading;
  const categoryOptions: Option[] = !categories
    ? []
    : categories?.map((category) => ({
        label: category.name,
        value: category._id,
      }));

  const schema = z.object({
    tags: z.array(schemas.tag).min(1),
    markdown: z.string(),
    description: z.string(),
    meta: z.object({
      description: z.string(),
      keywords: z.array(z.string()).min(1),
      title: z.string(),
    }),
    shouldPublish: z.boolean(),
    category: z.string(),
    title: z.string(),
    slug: z.string(),
    cover: z.instanceof(File),
  });

  type FormData = z.infer<typeof schema>;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      meta: {
        description: '',
        keywords: [],
        title: '',
      },
      shouldPublish: false,
      category: undefined,
      slug: '',
      title: '',
      markdown: '',
      cover: undefined,
      tags: [],
    },
  });
  const title = watch('title');
  const markdown = watch('markdown');
  const cover = watch('cover');

  const onSubmit: SubmitHandler<FormData> = (values) => {
    console.log(values);
    const finalValues = {
      ...values,
      tags: values.tags.map((tag: any) => tag._id),
    };
    const formData = buildFormData(finalValues);
    createArticle.mutate(formData, {
      onSuccess: ({ id }) => {
        reset();
        toast.success(ToastItemCreated('article', `/articles/${id}`));
      },
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              md: 8,
              xs: 12,
            }}
          >
            <Card sx={{ p: 2 }}>
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
                          minRows={6}
                          multiline
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
                          fullWidth
                          id="markdown"
                          label="Markdown"
                          minRows={10}
                          maxRows={16}
                          multiline
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="cover"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <ImageDropzone
                          file={value}
                          onDrop={(file: any) => {
                            onChange(file);
                          }}
                          onError={(error: string) => {
                            setError('cover', { message: error });
                          }}
                        />
                      );
                    }}
                  />
                  {!!errors.cover && (
                    <FormHelperText error>
                      {errors.cover.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid
            container
            size={{
              md: 4,
              xs: 12,
            }}
            spacing={2}
            sx={{ height: 'fit-content' }}
          >
            <Grid size={12}>
              <Card sx={{ p: 2 }}>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid size={12}>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => {
                        return (
                          <TextInput
                            {...field}
                            label="Category"
                            error={!!errors.category}
                            helperText={errors.category?.message}
                            fullWidth
                            select
                            id="category"
                          >
                            {categoryOptions.map((category) => (
                              <MenuItem
                                value={category.value}
                                key={category.value}
                              >
                                {category.label}
                              </MenuItem>
                            ))}
                          </TextInput>
                        );
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
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
                            options={tags || []}
                            renderInput={(params) => (
                              <TextInput
                                {...params}
                                {...rest}
                                label="Tags"
                                error={!!errors.tags}
                                helperText={errors.tags?.message}
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid size={12}>
              <Card sx={{ p: 2 }}>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid size={12}>
                    <Controller
                      name="meta.title"
                      control={control}
                      render={({ field }) => {
                        return (
                          <TextInput
                            {...field}
                            error={!!errors.meta?.title}
                            helperText={errors.meta?.title?.message}
                            fullWidth
                            id="meta-title"
                            label="Meta title"
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="meta.description"
                      control={control}
                      render={({ field }) => {
                        return (
                          <TextInput
                            {...field}
                            error={!!errors.meta?.description}
                            helperText={errors.meta?.description?.message}
                            fullWidth
                            id="meta-description"
                            label="Meta description"
                            minRows={6}
                            multiline
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="meta.keywords"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => {
                        return (
                          <Autocomplete
                            autoHighlight
                            value={value}
                            filterSelectedOptions
                            id="meta-keywords"
                            multiple
                            onChange={(event: SyntheticEvent, newValue) => {
                              onChange(newValue);
                            }}
                            options={metaKeywordOptions || []}
                            renderInput={(params) => (
                              <TextInput
                                {...params}
                                {...rest}
                                label="Meta keywords"
                                error={!!errors.meta?.keywords}
                                helperText={errors.meta?.keywords?.message}
                              />
                            )}
                          />
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid size={12}>
              <Controller
                name="shouldPublish"
                control={control}
                render={({ field: { value, name, onChange } }) => {
                  return (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          name={name}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            onChange(event.target.checked);
                          }}
                        />
                      }
                      label="Publish"
                      labelPlacement="start"
                    />
                  );
                }}
              />
            </Grid>
            <Grid
              container
              spacing={2}
            >
              <Grid size={6}>
                <Button
                  color="secondary"
                  fullWidth
                  size="large"
                  variant="text"
                  onClick={handleOpenPreview}
                  type="button"
                >
                  Preview
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={dataIsLoading}
                  isLoading={createArticle.isPending || updateArticle.isPending}
                >
                  Post
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      {openPreview && (
        <MarkdownPreview
          open
          onClose={handleClosePreview}
          title={title}
          markdown={markdown}
          cover={cover ? URL.createObjectURL(cover) : undefined}
          onSave={(markdown: string) => setValue('markdown', markdown)}
        />
      )}
    </>
  );
};
