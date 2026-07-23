import ReviewsTable from '@/components/reviews-table';
import { useParams } from 'react-router';
import { useSearchUserReviews } from './api';

export const UserReviews = () => {
  const { id } = useParams<{ id: string }>();
  const { data, refetch, isError, isLoading } = useSearchUserReviews(id);
  const { reviews, count } = data || {};

  return (
    <>
      <title>Reviews</title>
      <ReviewsTable
        reviews={reviews}
        count={count}
        showUser={false}
        refetch={refetch}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
};
