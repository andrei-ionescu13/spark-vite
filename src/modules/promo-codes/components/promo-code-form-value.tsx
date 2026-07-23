import { AddProductsDialog } from '@/components/add-products-dialog';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { useDialog } from '@/hooks/useDialog';
import type { Product } from '@/types/products';
import {
  ButtonGroup,
  Card,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { TrashIcon } from 'lucide-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { PromoCodeFormValues } from '../create/create-promo-code-form ';

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

export const PromoCodeFormValue = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PromoCodeFormValues>();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const type = useWatch({ control, name: 'type' });
  const products = useWatch({ control, name: 'products' });
  const productSelection = useWatch({ control, name: 'productSelection' });

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
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  id="value"
                  label="Discount value"
                  name="value"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : Number(e.target.value)
                    )
                  }
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
            <Controller
              control={control}
              name="productSelection"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="general"
                    control={<Radio />}
                    label="General"
                  />
                  <FormControlLabel
                    value="selected"
                    control={<Radio />}
                    label="Selected products"
                  />
                </RadioGroup>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Button
              disabled={productSelection !== 'selected'}
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
          {productSelection === 'selected' && !!products.length && (
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
          )}
        </Grid>
      </Card>
    </>
  );
};
