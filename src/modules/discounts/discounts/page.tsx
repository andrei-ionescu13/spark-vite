import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { useSearchDiscounts } from './api';
import { DiscountsTable } from './discounts-table';

export const Discounts = () => {
  const { data, refetch, isError, isLoading } = useSearchDiscounts();
  const { discounts, count } = data || {};

  return (
    <>
      <title>Discounts</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Discounts"
            action={{
              href: '/discounts/create',
              label: 'Create',
              icon: PlusIcon,
            }}
          />
          <DiscountsTable
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
            discounts={discounts}
            count={count}
          />
        </Container>
      </Box>
    </>
  );
};
