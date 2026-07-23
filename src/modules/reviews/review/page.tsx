import { Box, Container, Grid } from '@mui/material';
import { useParams } from 'react-router';
import { useGetReview } from './api';
import { ReviewHeader } from './review-header';
import { ReviewProduct } from './review-product';
import { ReviewStatus } from './review-status';
import { ReviewsDetails } from './reviews-details';

export const Review = () => {
  const { id } = useParams<{ id: string }>();
  const { data: review, isLoading } = useGetReview(id);

  return (
    <>
      <title>Review</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <ReviewHeader
            review={review}
            isLoading={isLoading}
          />
          {!!review && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                <ReviewsDetails review={review} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
                container
                spacing={2}
              >
                <Grid size={12}>
                  <ReviewStatus review={review} />
                </Grid>
                <Grid size={12}>
                  <ReviewProduct review={review} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};
