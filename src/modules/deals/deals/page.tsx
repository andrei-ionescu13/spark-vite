import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { useSearchDealsQuery } from './api';
import { DealsTable } from './deals-table';

export const Deals = () => {
  const { data, refetch, isError, isLoading } = useSearchDealsQuery();
  const { deals, count } = data || {};

  return (
    <>
      <title>Deals</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Deals"
            action={{
              href: '/products/deals/create',
              label: 'Create',
              icon: PlusIcon,
            }}
          />
          <DealsTable
            deals={deals}
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
