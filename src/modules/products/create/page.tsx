import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { ProductForm } from './product-form';

export const ProductCreate = () => {
  return (
    <>
      <title>Create product</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <PageHeader title="Create Product" />
          <ProductForm />
        </Container>
      </Box>
    </>
  );
};
