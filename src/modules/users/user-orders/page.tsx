import { OrdersTable } from '@/components/orders-table';
import { useSearchUserOrders } from './api';

export const UserOrders = () => {
  const { data, refetch, isError, isLoading } = useSearchUserOrders();
  const { orders, count } = data || {};

  return (
    <>
      <title>User Orders</title>
      <OrdersTable
        showCustomer={false}
        orders={orders}
        count={count}
        refetch={refetch}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
};
