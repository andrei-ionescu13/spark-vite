import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { OrdersTable } from '../../../components/orders-table';
import { useSearchOrders } from './api';

export const Orders = () => {
  const { data, refetch, isError, isLoading } = useSearchOrders();
  const { orders, count } = data || {};

  return (
    <>
      <title>Orders</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Orders" />
          <OrdersTable
            orders={orders}
            count={count}
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
          />
        </Container>
      </Box>
    </>
  );
};
