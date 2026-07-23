import { Button } from '@/components/button';
import { ImageUpdate } from '@/components/image-update';
import { ImagesDropzone } from '@/components/images-dropzone';
import { TextInput } from '@/components/text-input';
import type { Image } from '@/types/common';
import type { Product } from '@/types/products';
import { buildFormData } from '@/utils/build-form-data';
import { isString } from '@/utils/is-string';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { FileWithPath } from 'react-dropzone';
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import * as z from 'zod';
import { ProductImage } from '../components/product-image';
import { useUpdateProductMedia } from './api';

const isFile = (file: any): file is File => file instanceof File;

const fileSchema = z.object({ public_id: z.string(), url: z.string() });

interface ProductUpdateMediaFormProps {
  product: Product;
  onClose: () => void;
}

export const ProductUpdateMediaForm = ({
  product,
  onClose,
}: ProductUpdateMediaFormProps) => {
  const queryClient = useQueryClient();
  const updateProductMedia = useUpdateProductMedia(product._id);
  const [newVideo, setNewVideo] = useState('');
  const [newVideoError, setNewVideoError] = useState('');
  const newVideoSchema = z.url();

  const handleNewVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewVideoError('');
    setNewVideo(event.target.value);
  };

  const schema = z.object({
    cover: z.union([z.file(), z.string()]),
    images: z.array(z.union([z.file(), fileSchema])).min(1),
    selectedImages: z.array(z.union([z.file(), z.string()])).min(1),
    videos: z.array(z.object({ url: z.string() })).min(1),
  });

  type FormValues = z.infer<typeof schema>;

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
      cover: product.cover.url,
      videos: product.videos.map((video) => ({ url: video })),
      images: product.images,
      selectedImages: product.selectedImages.map(
        (image: Image) => image?.public_id
      ),
    },
  });
  const selectedImages = watch('selectedImages');
  const images = watch('images');

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formValues: any = { ...values };
    formValues.images = values.images.map((image) =>
      isFile(image) ? image : image.public_id
    );
    const formData = buildFormData(formValues);

    updateProductMedia.mutate(formData, {
      onSuccess: (updatedProduct) => {
        queryClient.setQueryData(['product', product._id], {
          ...product,
          ...updatedProduct,
        });
        onClose();
      },
    });
  };

  const handleSelectImage = (item: File | Pick<Image, 'public_id'>): void => {
    if (
      selectedImages.includes(isFile(item) ? item.name || '' : item.public_id)
    ) {
      setValue(
        'selectedImages',
        selectedImages.filter((image) => {
          return isFile(item) ? image !== item.name : image !== item.public_id;
        })
      );
      return;
    }

    setValue('selectedImages', [
      ...selectedImages,
      isFile(item) ? item.name : item.public_id,
    ]);
  };

  const handleImageDelete = (item: File | Pick<Image, 'public_id'>) => {
    setValue(
      'images',
      images.filter((image) => {
        if (isFile(image) && isFile(item)) return image.name !== item.name;

        if (!isFile(image) && !isFile(item))
          return image.public_id !== item.public_id;
      })
    );
    setValue(
      'selectedImages',
      selectedImages.filter((image) => {
        if (isFile(image) && isFile(item)) return image.name !== item.name;

        if (!isFile(image) && !isFile(item)) return image !== item.public_id;
      })
    );
  };

  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: 'videos',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={2}
            >
              <Grid size={12}>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  Cover
                </Typography>
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
              <Grid size={12}>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  Videos
                </Typography>

                <Grid
                  container
                  spacing={2}
                >
                  {fields.map((video, index) => (
                    <Grid
                      size={12}
                      key={video.id}
                      sx={{
                        display: 'grid',
                        alignItems: 'center',
                        gridTemplateColumns: '1fr auto',
                        gridAutoFlow: 'column',
                        gap: 2,
                      }}
                    >
                      <Controller
                        key={video.id}
                        name={`videos.${index}.url`}
                        control={control}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            fullWidth
                            size="small"
                            disabled
                          />
                        )}
                      />

                      <Button
                        color="error"
                        variant="text"
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  ))}
                  <Grid size={12}>
                    <Box
                      sx={{
                        display: 'grid',
                        alignItems: 'center',
                        gridTemplateColumns: '1fr auto',
                        gridAutoFlow: 'column',
                        gap: 2,
                      }}
                    >
                      <TextInput
                        fullWidth
                        id="newVideo"
                        name="newVideo"
                        onChange={handleNewVideoChange}
                        value={newVideo}
                        size="small"
                      />
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          const result = newVideoSchema.safeParse(newVideo);

                          if (!result.success) {
                            setNewVideoError(result.error.issues[0].message);
                            return;
                          }

                          append({ url: result.data });
                          setNewVideo('');
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                    {!!errors.videos && (
                      <FormHelperText error>
                        {errors.videos.message}
                      </FormHelperText>
                    )}
                    {!!newVideoError && (
                      <FormHelperText error>{newVideoError}</FormHelperText>
                    )}
                  </Grid>
                  <Grid size={12}>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Images
                    </Typography>
                    <ImagesDropzone
                      onDrop={(files: FileWithPath[]) => {
                        setValue('images', [...images, ...files]);
                        setValue('selectedImages', [
                          ...selectedImages,
                          ...files.map((file) => file.name),
                        ]);
                      }}
                    />
                    {!!images.length && (
                      <Box
                        sx={{
                          mt: 5,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 2,
                        }}
                      >
                        {images.map((item) => (
                          <ProductImage
                            image={
                              isFile(item)
                                ? URL.createObjectURL(item)
                                : item.url
                            }
                            key={
                              isFile(item) ? item.name || '' : item?.public_id
                            }
                            onDelete={() => {
                              handleImageDelete(item);
                            }}
                            selected={selectedImages.includes(
                              isFile(item) ? item.name || '' : item?.public_id
                            )}
                            onSelect={() => {
                              handleSelectImage(item);
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    {!!errors.images && (
                      <FormHelperText error>
                        {errors.images.message}
                      </FormHelperText>
                    )}
                    {!errors.images && !!errors.selectedImages && (
                      <FormHelperText error>
                        {errors.selectedImages.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            isLoading={updateProductMedia.isPending}
            variant="contained"
            size="large"
            type="submit"
          >
            Update
          </Button>
        </Box>
      </Box>
    </form>
  );
};
