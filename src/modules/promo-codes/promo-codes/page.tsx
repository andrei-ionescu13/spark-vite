import { Box, Container } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { PageHeader } from '../../../components/page-header';
import { useSearchPromoCodes } from './api';
import { PromoCodesTable } from './promo-codes-table';

export const PromoCodes = () => {
  const { data, isError, isLoading, refetch } = useSearchPromoCodes();
  const { promoCodes, count } = data || {};

  return (
    <>
      <title>Promo codes</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Promo codes"
            action={{
              href: '/promo-codes/create',
              label: 'Create',
              icon: PlusIcon,
            }}
          />
          <PromoCodesTable
            promoCodes={promoCodes}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
