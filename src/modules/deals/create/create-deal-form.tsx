import { AddProductsDialog } from '@/components/add-products-dialog';
import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { ImageDropzone } from '@/components/image-dropzone';
import { TextInput } from '@/components/text-input';
import { ToastCreatedMessage } from '@/components/toast-created-message';
import { useDialog } from '@/hooks/useDialog';
import type { Product } from '@/types/products';
import { buildFormData } from '@/utils/build-form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Card,
  FormHelperText,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { TrashIcon } from 'lucide-react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useCreateDeal } from './api';

const metaKeywordOptions = ['Games', 'News'];

export const CreateDealForm = () => {
  const createDeal = useCreateDeal();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  const schema = z
    .object({
      products: z
        .array(z.object({ title: z.string(), _id: z.string() }))
        .min(1),
      description: z.string(),
      meta: z.object({
        description: z.string(),
        keywords: z.array(z.string()).min(1),
        title: z.string(),
      }),
      title: z.string(),
      slug: z.string(),
      cover: z.file(),
      startDate: z.iso.datetime(),
      endDate: z.iso.datetime().optional(),
      shouldSetEndDate: z.boolean(),
    })
    .refine((data) => !data.shouldSetEndDate || !!data.endDate, {
      message: 'End Date required',
      path: ['endDate'],
    });

  type FormData = z.infer<typeof schema>;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      products: [],
      description: '',
      meta: {
        description: '',
        keywords: [],
        title: '',
      },
      slug: '',
      title: '',
      cover: undefined,
      startDate: undefined,
      endDate: undefined,
      shouldSetEndDate: false,
    },
  });
  const products = watch('products');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const shouldSetEndDate = watch('shouldSetEndDate');

  const onSubmit: SubmitHandler<FormData> = (values) => {
    const { endDate, ...formvalues } = values;
    const formData = buildFormData(formvalues);
    formData.append('endDate', shouldSetEndDate && endDate ? endDate : '');
    createDeal.mutate(formData, {
      onSuccess: (data) => {
        toast.success(
          <ToastCreatedMessage
            title="Deal created"
            subheader="Go to the deal"
            href={`/products/deals/${data._id}`}
          />
        );
      },
    });
  };

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setValue('shouldSetEndDate', event.target.checked);
  };

  return (
    <>
      {dialogOpen && (
        <AddProductsDialog
          open
          onClose={() => {
            handleCloseDialog();
          }}
          onAdd={(products: Product[]) => {
            setValue('products', products);
          }}
          selectedProducts={products}
        />
      )}
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
            container
            spacing={2}
          >
            <Grid size={12}>
              <Card sx={{ p: 2 }}>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid size={12}>
                    <Typography
                      color="textPrimary"
                      variant="subtitle1"
                    >
                      General
                    </Typography>
                  </Grid>
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
            <Grid size={12}>
              <Card sx={{ p: 2 }}>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid size={12}>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Products
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Button
                      onClick={handleOpenDialog}
                      color="primary"
                      variant="contained"
                    >
                      Browse
                    </Button>
                  </Grid>
                  {!!errors.products && (
                    <Grid size={12}>
                      <div>{errors.products.message}</div>
                    </Grid>
                  )}
                  <Grid size={12}>
                    <List disablePadding>
                      {products.map((product) => (
                        <ListItem
                          key={product._id}
                          disableGutters
                          divider
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Link
                            color="textPrimary"
                            variant="body1"
                            underline="hover"
                            href={`/products/${product._id}`}
                          >
                            {product.title}
                          </Link>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setValue(
                                'products',
                                products.filter(
                                  (_product) => _product._id !== product._id
                                )
                              );
                            }}
                          >
                            <TrashIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid size={12}>
              <FormInterval
                onShouldSetEndDateChange={onShouldSetEndDateChange}
                shouldSetEndDate={shouldSetEndDate}
                startDate={{
                  value: startDate,
                  onChange: (value: string) => setValue('startDate', value),
                  error: errors.startDate?.message,
                }}
                endDate={{
                  value: endDate,
                  onChange: (value: string) => setValue('endDate', value),
                  error: errors.endDate?.message,
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ height: 'fit-content' }}
            size={{
              md: 4,
              xs: 12,
            }}
          >
            <Grid size={12}>
              <Card sx={{ p: 2 }}>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid size={12}>
                    <Typography
                      color="textPrimary"
                      variant="subtitle1"
                    >
                      Meta
                    </Typography>
                  </Grid>
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
                            label="Title"
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
                            label="Description"
                            minRows={4}
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
                      render={({ field }) => {
                        return (
                          <Autocomplete
                            filterSelectedOptions
                            freeSolo
                            getOptionLabel={(option) => option}
                            id="meta-keywords"
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
                                onBlur={field.onBlur}
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
              <Button
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                onClick={() => {}}
                isLoading={createDeal.isPending}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
