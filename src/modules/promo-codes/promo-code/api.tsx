import type { PromoCode } from '@/types/promo-code';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getPromoCode =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<PromoCode>({
      url: `/promo-codes/${id}`,
      withAuth: true,
      ...config,
    });

export const usePromoCode = (id: string) => {
  return useQuery({
    queryKey: ['promo-code', id],
    queryFn: getPromoCode(id),
  });
};

export const useUpdatePromoCode = (onSuccess: () => Promise<any>) =>
  useMutation<PromoCode, Error, { id: string; body: Record<string, any> }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/promo-codes/${id}`,
        config: {
          method: 'PUT',
          body: JSON.stringify(body),
        },
        withAuth: true,
      }),
    onSuccess,
  });
