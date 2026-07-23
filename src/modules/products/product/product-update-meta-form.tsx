import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import type { Product } from '@/types/products';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useUpdateProductMeta } from './api';

const metaKeywordOptions = ['Games', 'News', 'mopneydas'];

const schema = z.object({
  metaDescription: z.string().max(512, 'Must be 512 characters or less'),
  metaKeywords: z.array(z.string()).min(1),
  metaTitle: z.string().max(100),
});

type FormData = z.infer<typeof schema>;

interface ProductUpdateMetaFormProps {
  product: Product;
  onClose: () => void;
}

export const ProductUpdateMetaForm = ({
  product,
  onClose,
}: ProductUpdateMetaFormProps) => {
  const queryClient = useQueryClient();
  const updateProductMeta = useUpdateProductMeta(product._id);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      metaDescription: product.metaDescription,
      metaKeywords: product.metaKeywords,
      metaTitle: product.metaTitle,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    updateProductMeta.mutate(values, {
      onSuccess: (data) => {
        queryClient.setQueryData(['product', product._id], {
          ...product,
          ...data,
        });
        onClose;
      },
    });
  };

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
                <Controller
                  name="metaTitle"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.metaTitle}
                        helperText={errors.metaTitle?.message}
                        fullWidth
                        id="metaTitle"
                        label="Title"
                      />
                    );
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="metaDescription"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.metaDescription}
                        helperText={errors.metaDescription?.message}
                        fullWidth
                        id="metaDescription"
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
                  name="metaKeywords"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => {
                    return (
                      <Autocomplete
                        options={metaKeywordOptions}
                        filterSelectedOptions
                        freeSolo
                        multiple
                        onChange={(event: SyntheticEvent, newValue) => {
                          onChange(newValue);
                        }}
                        value={value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...rest}
                            label="Keywords"
                            error={!!errors.metaKeywords}
                            helperText={errors.metaKeywords?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
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
            variant="text"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            isLoading={updateProductMeta.isPending}
            type="submit"
          >
            Update
          </Button>
        </Box>
      </Box>
    </form>
  );
};
