import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router';
import * as z from 'zod';
import { useCreateKey } from '../api';

const schema = z.object({
  key: z.string().min(12).max(64, 'Must be 64 characters or less'),
});

type FormData = z.infer<typeof schema>;

interface ProductAddKeyDialogProps {
  open: boolean;
  onClose: any;
  productId: string;
}

export const ProductAddKeyDialog = ({
  open,
  onClose,
  productId,
}: ProductAddKeyDialogProps) => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const createKey = useCreateKey(() =>
    queryClient.invalidateQueries({
      queryKey: ['product-keys', id, searchParams],
    })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async ({ key }) => {
    createKey.mutate(
      { productId, key },
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
        <DialogTitle>Add key</DialogTitle>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="key"
                control={control}
                render={({ field }) => {
                  return (
                    <TextInput
                      {...field}
                      size="small"
                      autoComplete="key"
                      error={!!errors.key}
                      helperText={errors.key?.message}
                      fullWidth
                      id="key"
                      label="Key"
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            isLoading={createKey.isPending}
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// interface SearchProductKeysData {
//   keys: Key[];
//   count: number;
// }

// const searchProductKeys =
//   (id: string, query: Record<string, any>, config: Record<string, any> = {}) =>
//   () =>
//     appFetch<SearchProductKeysData>({
//       url: `/products/${id}/keys`,
//       query,
//       ...config,
//     });
