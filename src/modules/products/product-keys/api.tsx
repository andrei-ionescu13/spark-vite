import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Key } from 'react';

interface SearchProductKeysData {
  keys: Key[];
  count: number;
}

export const searchProductKeys =
  (id: string, query: Record<string, any>) => () =>
    appFetch<SearchProductKeysData>({
      url: `/products/${id}/keys`,
      query,
    });

export const useSearchProductKeys = (id: string) => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['product-keys', id, query],
    queryFn: searchProductKeys(id, query),
  });
};

export const useImportProductKeys = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; formData: FormData }>({
    mutationFn: ({ id, formData }) =>
      appFetch({
        url: `/products/${id}/keys/import`,
        config: {
          body: formData,
          method: 'POST',
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess,
  });
