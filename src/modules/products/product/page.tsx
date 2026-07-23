import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { Grid } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useGetProduct } from '../api';
import { ProductDiscount } from '../components/product-discount';
import { ProductStatus } from '../components/product-status';
import { ProductGeneral } from './product-general';
import { ProductMedia } from './product-media';
import { ProductMeta } from './product-meta';
import { ProductUpdateGeneralForm } from './product-update-general-form';
import { ProductUpdateMediaForm } from './product-update-media-form';
import { ProductUpdateMetaForm } from './product-update-meta-form';

type DisplayedForm = 'details' | 'media' | 'meta' | null;

export const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useGetProduct(id);

  const discountStatus =
    product?.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);
  const isEditDisabled = product?.status === 'archived';
  const [displayedForm, setDisplayedForm] = useState<DisplayedForm>();

  const handleDisplayForm = (displayedForm: DisplayedForm) => {
    window.scrollTo(0, 0);
    setDisplayedForm(displayedForm);
  };

  const handleHideForm = () => {
    window.scrollTo(0, 0);
    setDisplayedForm(null);
  };

  return (
    <>
      <title>Product</title>
      {product && displayedForm === 'details' && (
        <ProductUpdateGeneralForm
          product={product}
          onClose={handleHideForm}
        />
      )}
      {product && displayedForm === 'media' && (
        <ProductUpdateMediaForm
          product={product}
          onClose={handleHideForm}
        />
      )}
      {product && displayedForm === 'meta' && (
        <ProductUpdateMetaForm
          product={product}
          onClose={handleHideForm}
        />
      )}
      {!!product && !displayedForm && (
        <Grid
          container
          spacing={2}
        >
          <Grid
            container
            size={{
              xs: 12,
              md: 8,
            }}
            spacing={2}
          >
            <Grid size={12}>
              <ProductGeneral
                product={product}
                isEditDisabled={isEditDisabled}
                onEdit={() => {
                  handleDisplayForm('details');
                }}
              />
            </Grid>
            <Grid size={12}>
              <ProductMedia
                product={product}
                isEditDisabled={isEditDisabled}
                onEdit={() => {
                  handleDisplayForm('media');
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            size={{
              xs: 12,
              md: 4,
            }}
            spacing={2}
            sx={{ height: 'fit-content' }}
          >
            <Grid size={12}>
              <ProductStatus product={product} />
            </Grid>
            <Grid size={12}>
              <ProductMeta
                product={product}
                isEditDisabled={isEditDisabled}
                onEdit={() => {
                  handleDisplayForm('meta');
                }}
              />
            </Grid>
            {product?.discount && discountStatus != 'expired' && (
              <Grid size={12}>
                <ProductDiscount discount={product.discount} />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};
