import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  colors,
  useTheme,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { Button } from '../../../components/button';
import type { StatusOption } from '../../../components/status';
import { StatusSelect } from '../../../components/status';
import type { Product } from '../../../types/products';
import { useUpdateProductStatus } from '../product/api';

interface ProductStatusProps {
  product: Product;
}

export const ProductStatus = ({ product }: ProductStatusProps) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const updateProductStatus = useUpdateProductStatus(product._id);

  const statusOptions: StatusOption[] = [
    {
      label: 'Published',
      value: 'published',
      color: theme.palette.success.main,
    },
    {
      label: 'Draft',
      value: 'draft',
      color: colors.grey[500],
    },
    {
      label: 'Archived',
      value: 'archived',
      color: theme.palette.error.main,
    },
  ];

  const schema = z.object({
    status: z.enum(statusOptions.map((status) => status.value)),
  });

  type FormData = z.infer<typeof schema>;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: product.status,
    },
  });
  const status = watch('status');

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    updateProductStatus.mutate(values, {
      onSuccess: (status) => {
        queryClient.setQueryData(['product', product._id], {
          ...product,
          status,
        });
        toast.success('Product updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const isDisabled = product.status === status;

  return (
    <Card>
      <CardHeader title="Status" />
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '9fr 3fr',
              gap: 1,
            }}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl
                  error={!!errors.status}
                  fullWidth
                  size="small"
                >
                  <StatusSelect
                    {...field}
                    id="status"
                    options={statusOptions}
                  />
                  {!!errors.status?.message && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Button
              fullWidth
              color="primary"
              variant="contained"
              disabled={isDisabled}
              isLoading={updateProductStatus.isPending}
              type="submit"
            >
              Update
            </Button>
          </Box>
        </CardContent>
      </form>
    </Card>
  );
};
