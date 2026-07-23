import { Button } from '@/components/button';
import { DateInput } from '@/components/date-picker';
import { MarkdownPreview } from '@/components/markdown-preview';
import { TextInput } from '@/components/text-input';
import { useDialog } from '@/hooks/useDialog';
import type { Product } from '@/types/products';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { EyeIcon } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import React, { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import {
  useListDevelopersQuery,
  useListFeaturesQuery,
  useListGenresQuery,
  useListLanguagesQuery,
  useListOperatingSystemsQuery,
  useListPlatformsQuery,
  useListPublishersQuery,
} from '../api';
import { useUpdateProductGeneral } from './api';

const schema = z.object({
  title: z.string(),
  price: z.number().positive().optional(),
  genres: z
    .array(
      z.object({
        name: z.string(),
        _id: z.string(),
      })
    )
    .min(1),
  releaseDate: z.string(),
  slug: z.string(),
  publisher: z.object({
    name: z.string(),
    _id: z.string(),
  }),
  platform: z.object({
    name: z.string(),
    _id: z.string(),
  }),
  developers: z
    .array(
      z.object({
        name: z.string(),
        _id: z.string(),
      })
    )
    .min(1),
  languages: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
        nativeName: z.string(),
        _id: z.string(),
      })
    )
    .min(1),
  features: z
    .array(
      z.object({
        name: z.string(),
        _id: z.string(),
      })
    )
    .min(1),
  link: z.string(),
  os: z
    .array(
      z.object({
        name: z.string(),
        _id: z.string(),
      })
    )
    .min(1),
  markdown: z.string(),
  minimumRequirements: z.string(),
  recommendedRequirements: z.string(),
  shouldPublish: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ProductUpdateGeneralFormProps {
  product: Product;
  onClose: () => void;
}

export const ProductUpdateGeneralForm = ({
  product,
  onClose,
}: ProductUpdateGeneralFormProps) => {
  const queryClient = useQueryClient();
  const updateProductGeneral = useUpdateProductGeneral(product._id);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [previewSelected, setPreviewSelected] = useState<
    'minimumRequirements' | 'recommendedRequirements' | 'markdown' | undefined
  >();
  const discountStatus =
    product.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);

  const [autocompleteOpen, setAutocompleteOpen] = useState({
    developers: false,
    features: false,
    genres: false,
    languages: false,
    os: false,
    platform: false,
    publisher: false,
  });

  const handleAutocompleteOpenToggle = (field: string, value: boolean) => {
    setAutocompleteOpen((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const listDevelopersQuery = useListDevelopersQuery({
    enabled: autocompleteOpen.features,
  });
  const listFeaturesQuery = useListFeaturesQuery({
    enabled: autocompleteOpen.features,
  });
  const listGenresQuery = useListGenresQuery({
    enabled: autocompleteOpen.genres,
  });
  const listLanguagesQuery = useListLanguagesQuery({
    enabled: autocompleteOpen.languages,
  });
  const listOperatingSystemsQuery = useListOperatingSystemsQuery({
    enabled: autocompleteOpen.os,
  });
  const listPlatformsQuery = useListPlatformsQuery({
    enabled: autocompleteOpen.platform,
  });
  const listPublishersQuery = useListPublishersQuery({
    enabled: autocompleteOpen.publisher,
  });

  const genres = listGenresQuery.data || [];
  const publishers = listPublishersQuery.data || [];
  const platforms = listPlatformsQuery.data || [];
  const developers = listDevelopersQuery.data || [];
  const features = listFeaturesQuery.data || [];
  const languages = listLanguagesQuery.data || [];
  const operatingSystems = listOperatingSystemsQuery.data || [];

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: product.title,
      price: product.price,
      genres: product.genres,
      releaseDate: product.releaseDate,
      publisher: product.publisher,
      developers: product.developers,
      languages: product.languages,
      features: product.features,
      link: product.link,
      markdown: product.markdown,
      slug: product.slug,
      os: product.os,
      platform: product.platform,
      minimumRequirements: product.minimumRequirements,
      recommendedRequirements: product.recommendedRequirements,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formValues = {
      ...values,
      genres: values.genres.map((genre) => genre._id),
      features: values.features.map((feature) => feature._id),
      developers: values.developers.map((developer) => developer._id),
      os: values.os.map((_os) => _os._id),
      platform: values.platform._id,
      publisher: values.publisher._id,
    };

    if (discountStatus !== 'expired') {
      delete formValues.price;
    }

    updateProductGeneral.mutate(formValues, {
      onSuccess: (updatedProduct) => {
        queryClient.setQueryData(['product', product._id], {
          ...product,
          ...updatedProduct,
        });
        onClose();
      },
    });
  };

  return (
    <>
      {dialogOpen && previewSelected && (
        <MarkdownPreview
          open
          onClose={handleCloseDialog}
          markdown={watch(previewSelected)}
          onSave={(markdown: string) => setValue(previewSelected, markdown)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
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
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextInput
                          {...field}
                          disabled={
                            product.discount && discountStatus !== 'expired'
                          }
                          error={!!errors.price}
                          helperText={errors.price?.message}
                          fullWidth
                          id="price"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            },
                          }}
                          label="Price"
                          name="price"
                          type="number"
                          info={
                            product.discount && discountStatus !== 'expired'
                              ? `Cannot change price for a product with ${discountStatus} discount`
                              : ''
                          }
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
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
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="publisher"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          open={autocompleteOpen.publisher}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('publisher', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('publisher', false);
                          }}
                          loading={listPublishersQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={publishers}
                          filterSelectedOptions
                          id="publisher"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="Publisher"
                              error={!!errors.publisher}
                              helperText={errors.publisher?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listPublishersQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="platform"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          open={autocompleteOpen.platform}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('platform', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('platform', false);
                          }}
                          loading={listPlatformsQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={platforms}
                          filterSelectedOptions
                          id="platform"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="platform"
                              error={!!errors.platform}
                              helperText={errors.platform?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listPlatformsQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="os"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          multiple
                          open={autocompleteOpen.os}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('os', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('os', false);
                          }}
                          loading={listOperatingSystemsQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={operatingSystems}
                          filterSelectedOptions
                          id="os"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="Os"
                              error={!!errors.os}
                              helperText={errors.os?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listOperatingSystemsQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="developers"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          multiple
                          open={autocompleteOpen.developers}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('developers', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('developers', false);
                          }}
                          loading={listDevelopersQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={developers}
                          filterSelectedOptions
                          id="developers"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="Developers"
                              error={!!errors.developers}
                              helperText={errors.developers?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listDevelopersQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="features"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          multiple
                          open={autocompleteOpen.features}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('features', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('features', false);
                          }}
                          loading={listFeaturesQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={features}
                          filterSelectedOptions
                          id="features"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="Features"
                              error={!!errors.features}
                              helperText={errors.features?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listFeaturesQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="genres"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          multiple
                          open={autocompleteOpen.genres}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('genres', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('genres', false);
                          }}
                          loading={listGenresQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={genres}
                          filterSelectedOptions
                          id="genres"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="Genres"
                              error={!!errors.genres}
                              helperText={errors.genres?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listGenresQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextInput
                          {...field}
                          error={!!errors.link}
                          helperText={errors.link?.message}
                          fullWidth
                          id="link"
                          label="Link"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="languages"
                    control={control}
                    render={({ field: { value, onChange, ...rest } }) => {
                      return (
                        <Autocomplete
                          multiple
                          open={autocompleteOpen.languages}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onOpen={() => {
                            handleAutocompleteOpenToggle('languages', true);
                          }}
                          onClose={() => {
                            handleAutocompleteOpenToggle('languages', false);
                          }}
                          loading={listLanguagesQuery.isFetching}
                          getOptionLabel={(option) => option.name}
                          options={languages}
                          filterSelectedOptions
                          id="languages"
                          onChange={(event: SyntheticEvent, newValue) => {
                            onChange(newValue);
                          }}
                          value={value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...rest}
                              label="Language"
                              error={!!errors.languages}
                              helperText={errors.languages?.message}
                              slotProps={{
                                ...params.slotProps,
                                input: {
                                  ...params.slotProps.input,
                                  endAdornment: (
                                    <React.Fragment>
                                      {listLanguagesQuery.isFetching ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.slotProps.input.endAdornment}
                                    </React.Fragment>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    control={control}
                    name="releaseDate"
                    render={({ field: { value, onChange, ...rest } }) => (
                      <DateInput
                        sx={{ width: '100%' }}
                        disablePast
                        label="Start date"
                        value={value ? dayjs(value) : null}
                        onChange={(value: PickerValue) => {
                          onChange(value?.toISOString());
                        }}
                        slotProps={{
                          textField: {
                            helperText: errors.releaseDate,
                            ...rest,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="minimumRequirements"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextInput
                          {...field}
                          error={!!errors.minimumRequirements}
                          helperText={errors.minimumRequirements?.message}
                          fullWidth
                          id="minimumRequirements"
                          label="Minimum Requirements"
                          minRows={10}
                          maxRows={16}
                          multiline
                        />
                      );
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setPreviewSelected('minimumRequirements');
                        handleOpenDialog();
                      }}
                    >
                      <EyeIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Controller
                    name="recommendedRequirements"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextInput
                          {...field}
                          error={!!errors.recommendedRequirements}
                          helperText={errors.recommendedRequirements?.message}
                          fullWidth
                          id="recommendedRequirements"
                          label="Recommended Requirements"
                          minRows={10}
                          maxRows={16}
                          multiline
                        />
                      );
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setPreviewSelected('recommendedRequirements');
                        handleOpenDialog();
                      }}
                    >
                      <EyeIcon />
                    </IconButton>
                  </Box>
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setPreviewSelected('markdown');
                        handleOpenDialog();
                      }}
                    >
                      <EyeIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
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
              color="inherit"
              size="large"
              sx={{ mr: 1 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              isLoading={updateProductGeneral.isPending}
              type="submit"
            >
              Update
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};
