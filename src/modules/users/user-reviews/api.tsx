import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import type { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import type { ParsedUrlQuery } from 'querystring';

interface SearchUserReviewsData {
  reviews: Review[];
  count: number;
}

export const searchUserReviews =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchUserReviewsData>({
      url: `/users/${id}/reviews`,
      query,
      withAuth: true,
      ...config,
    });

export const useSearchUserReviews = (id: String) => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['user-reviews', query],
    queryFn: searchUserReviews(id, query),
  });
};
