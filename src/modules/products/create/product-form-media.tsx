import { ImagesDropzone } from '@/components/images-dropzone';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
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
import { Button } from '../../../components/button';
import { ImageDropzone } from '../../../components/image-dropzone';
import { ProductImage } from '../components/product-image';

interface ProductFormMediaProps {
  onSubmit: any;
  onBack: any;
}

export const ProductFormMedia = ({
  onBack,
  onSubmit,
}: ProductFormMediaProps) => {
  const [newVideo, setNewVideo] = useState('');
  const [newVideoError, setNewVideoError] = useState('');
  const newVideoSchema = z.url();

  const handleNewVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewVideoError('');
    setNewVideo(event.target.value);
  };

  const schema = z.object({
    cover: z.file(),
    images: z.array(z.file()).min(1),
    selectedImages: z.array(z.string()).min(1),
    videos: z.array(z.object({ url: z.string().min(1) })),
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
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cover: undefined,
      videos: [],
      images: [],
      selectedImages: [],
    },
  });
  const selectedImages = watch('selectedImages');
  const images = watch('images');

  const handleNext: SubmitHandler<FormValues> = async (values) => {
    onSubmit(values);
  };

  const handleSelectImage = (file: FileWithPath): void => {
    if (selectedImages.includes(file.name)) {
      setValue(
        'selectedImages',
        selectedImages.filter((item: string) => item !== file.name)
      );
      return;
    }

    setValue('selectedImages', [...selectedImages, file.name]);
  };

  const handleImageDelete = (file: FileWithPath) => {
    setValue(
      'images',
      images.filter((item: FileWithPath) => item.name !== file.name)
    );
    setValue(
      'selectedImages',
      selectedImages.filter((item: string) => item !== file.name)
    );
  };

  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: 'videos',
  });

  return (
    <form onSubmit={handleSubmit(handleNext)}>
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
                  <FormHelperText error>{errors.cover.message}</FormHelperText>
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
                            image={URL.createObjectURL(item)}
                            key={item.name}
                            onDelete={() => {
                              handleImageDelete(item);
                            }}
                            selected={selectedImages
                              .map((item: string) => item)
                              .includes(item.name)}
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            color="inherit"
            onClick={onBack}
            size="large"
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="large"
          >
            Next
          </Button>
        </Box>
      </Box>
    </form>
  );
};
