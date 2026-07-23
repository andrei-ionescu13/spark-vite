import { Box, Container } from '@mui/material';
import { PageHeader } from '../../../components/page-header';
import { CreatePromoCodeForm } from './create-promo-code-form ';

export const PromoCodeCreate = () => {
  return (
    <>
      <title>Promo code Create</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/promo-codes"
            backLabel="Promo codes"
            title="Create promo code"
          />
          <CreatePromoCodeForm />
        </Container>
      </Box>
    </>
  );
};
