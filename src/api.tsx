import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Language } from './types/translations';

export const useDeleteReview = () =>
  useMutation({
    mutationFn: (id: string) =>
      appFetch({
        url: `/reviews/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
  });

export const useUpdateReviewStatus = (id: string) =>
  useMutation<{}, Error, string>({
    mutationFn: (status) =>
      appFetch({
        url: `/reviews/${id}/status`,
        config: {
          method: 'PUT',
          body: JSON.stringify({ status }),
        },
        withAuth: true,
      }),
  });

export const useDeleteReviews = () =>
  useMutation({
    mutationFn: (reviewIds: string[]) =>
      appFetch({
        url: '/reviews',
        config: {
          body: JSON.stringify({ ids: reviewIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
  });

export const listLanguages =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Language[]>({
      url: '/translations/languages',
      withAuth: true,
      ...config,
    });

export const useListNamespaceLanguagesQuery = () =>
  useQuery({
    queryKey: ['namespace-languages'],
    queryFn: listLanguages(),
  });
