import { AddProductsDialog } from '@/components/add-products-dialog';
import { Link } from '@/components/link';
import { TextInput } from '@/components/text-input';
import { useDialog } from '@/hooks/useDialog';
import type { Product } from '@/types/products';
import {
  Button,
  ButtonGroup,
  Card,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { TrashIcon } from 'lucide-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { CreateDiscountFormValues } from '../discount-create/create-discount-form';

const typeOptions = [
  {
    label: 'Fixed amount',
    value: 'amount',
  },
  {
    label: 'Percentage',
    value: 'percentage',
  },
];

export const DiscountFormValue = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateDiscountFormValues>();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const type = useWatch({ control, name: 'type' });
  const products = useWatch({ control, name: 'products' });

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
              Value
            </Typography>
          </Grid>
          <Grid size={12}>
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <ButtonGroup variant="outlined">
                  {typeOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                      }}
                      variant={
                        value === option.value ? 'contained' : 'outlined'
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </ButtonGroup>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              control={control}
              name="value"
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  id="value"
                  label="Discount value"
                  name="value"
                  slotProps={{
                    input: {
                      startAdornment:
                        type === 'amount' ? (
                          <InputAdornment position="start">$</InputAdornment>
                        ) : null,
                      endAdornment:
                        type === 'percentage' ? (
                          <InputAdornment position="end">%</InputAdornment>
                        ) : null,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Applies to
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
              <FormHelperText error>{errors.products.message}</FormHelperText>
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
                    to={`/products/${product._id}`}
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
    </>
  );
};
