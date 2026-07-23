import ReviewsTable from '@/components/reviews-table';
import { useParams } from 'react-router';
import { useSearchProductReviews } from './api';

export const ProductReviews = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useSearchProductReviews(id);
  const { reviews, count } = data || {};

  return (
    <>
      <title>Reviews</title>
      <ReviewsTable
        reviews={reviews}
        count={count}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
      />
    </>
  );
};
