import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { CreateDiscountForm } from './create-discount-form';

export const DiscountCreate = () => {
  return (
    <>
      <title>Discount Create</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/discounts"
            backLabel="Discounts"
            title="Create discount"
          />
          <CreateDiscountForm />
        </Container>
      </Box>
    </>
  );
};
