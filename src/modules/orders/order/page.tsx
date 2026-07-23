import { useParams } from 'react-router';
import { OrderLayout } from '../order-layout';
import { useGetOrder } from './api';

export const Order = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order } = useGetOrder(orderNumber);

  return (
    <>
      <title>Order</title>
      <OrderLayout>To be continued</OrderLayout>
    </>
  );
};
