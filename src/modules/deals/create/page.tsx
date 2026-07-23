import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { CreateDealForm } from './create-deal-form';

const DealCreate = () => {
  return (
    <>
      <title>Deal Create</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/products/deals"
            backLabel="Deals"
            title="Create deal"
          />
          <CreateDealForm />
        </Container>
      </Box>
    </>
  );
};

export default DealCreate;
