import type { Order } from '@/types/orders';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';

export const getOrder = (orderNumber: string) => () =>
  appFetch<Order>({
    url: `/orders/${orderNumber}`,
    withAuth: true,
  });

export const useGetOrder = (orderNumber: string) => {
  return useQuery({
    queryKey: ['orders', orderNumber],
    queryFn: getOrder(orderNumber),
  });
};
