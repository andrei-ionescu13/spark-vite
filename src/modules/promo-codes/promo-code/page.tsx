import { Box, Container } from '@mui/material';
import { useParams } from 'react-router';
import { usePromoCode } from './api';
import { PromoCodeHeader } from './promo-code-header';
import { UpdatePromoCodeForm } from './update-promo-code-form';

export const PromoCode = () => {
  const { id } = useParams<{ id: string }>();
  const { data: promoCode, isLoading, isRefetching } = usePromoCode(id);

  return (
    <>
      <title>Promo Code</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PromoCodeHeader
            promoCode={promoCode}
            isLoading={isLoading}
          />
          {!!promoCode && (
            <UpdatePromoCodeForm
              promoCode={promoCode}
              promoCodeIsRefetching={isRefetching}
            />
          )}
        </Container>
      </Box>
    </>
  );
};
