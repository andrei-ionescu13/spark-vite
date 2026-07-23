import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import type { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';

interface SearchUserReviewsData {
  reviews: Review[];
  count: number;
}

export const searchProductReviews =
  (id: string, query: Record<string, any>) => () =>
    appFetch<SearchUserReviewsData>({
      url: `/products/${id}/reviews`,
      query,
      withAuth: true,
    });

export const useSearchProductReviews = (id: string) => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['product-reviews', id, query],
    queryFn: searchProductReviews(id, query),
  });
};
