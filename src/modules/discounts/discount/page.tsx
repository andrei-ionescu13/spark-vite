import { Box, Container } from '@mui/material';
import { useParams } from 'react-router';
import { useGetDiscount } from './api';
import { DiscountHeader } from './discount-header';
import { UpdateDiscountForm } from './update-discount-form';

export const Discount = () => {
  const { id } = useParams<{ id: string }>();
  const { data: discount, isLoading } = useGetDiscount(id);

  return (
    <>
      <title>Discount</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <DiscountHeader
            discount={discount}
            isLoading={isLoading}
          />
          {discount && <UpdateDiscountForm discount={discount} />}
        </Container>
      </Box>
    </>
  );
};
