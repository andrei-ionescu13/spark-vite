import { useQuery } from '@tanstack/react-query';
import { getReview } from '../api';

export const useGetReview = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: getReview(id),
  });
};
