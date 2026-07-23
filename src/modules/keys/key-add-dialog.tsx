import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import React, { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../components/button';
import { TextInput } from '../../components/text-input';
import type { Product } from '../../types/products';
import { appFetch } from '../../utils/app-fetch';
import { useCreateKey } from '../products/api';

const schema = z.object({
  key: z.string(),
  product: z.object({ _id: z.string(), title: z.string() }),
});

type FormData = z.infer<typeof schema>;

interface GetProductsData {
  products: Product[];
  count: number;
}

const getProducts = (query: Record<string, any>) => () =>
  appFetch<GetProductsData>({
    url: '/products',
    query,
    withAuth: true,
  });

interface KeyAddDialogProps {
  open: boolean;
  onClose: any;
}

export const KeyAddDialog = ({ open, onClose }: KeyAddDialogProps) => {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const createKey = useCreateKey(() =>
    queryClient.invalidateQueries({ queryKey: ['keys'] })
  );
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['keys', 'products', { keyword }],
    queryFn: getProducts({ keyword }),
  });
  const { products } = productsData || { products: [], count: 0 };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    createKey.mutate(
      { productId: values?.product?._id || '', key: values.key },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Key</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                control={control}
                name="key"
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={!!errors.key}
                    helperText={errors.key?.message}
                    fullWidth
                    id="key"
                    label="Key"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="product"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => {
                  return (
                    <Autocomplete
                      getOptionLabel={(option) => option.title}
                      options={products}
                      loading={isLoading}
                      filterSelectedOptions
                      id="product"
                      onChange={(event: SyntheticEvent, newValue) => {
                        onChange(newValue);
                      }}
                      value={value}
                      onInputChange={(event, newInputValue) => {
                        setKeyword(newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...rest}
                          size="small"
                          label="Product"
                          error={!!errors.product}
                          helperText={errors.product?.message}
                          slotProps={{
                            ...params.slotProps,
                            input: {
                              ...params.slotProps.input,
                              endAdornment: (
                                <React.Fragment>
                                  {isLoading ? (
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
          </Grid>
          {createKey.isError && (
            <FormHelperText
              error
              sx={{ mt: 1 }}
            >
              {createKey.error.message}
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
            isLoading={createKey.isPending}
            variant="contained"
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
