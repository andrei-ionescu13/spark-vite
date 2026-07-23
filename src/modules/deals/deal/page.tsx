import { Box, Container } from '@mui/material';
import { useParams } from 'react-router';
import { useGetDealQuery } from './api';
import { DealHeader } from './deal-header';
import { UpdateDealForm } from './update-deal-form';

export const Deal = () => {
  const { id } = useParams<{ id: string }>();
  const { data: deal } = useGetDealQuery(id);

  return (
    <>
      <title>Deal</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <DealHeader />
          {deal && <UpdateDealForm deal={deal} />}
        </Container>
      </Box>
    </>
  );
};
