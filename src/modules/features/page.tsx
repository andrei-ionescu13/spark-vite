import { Box, Container } from '@mui/material';
import { useSearchFeaturesQuery } from './api';
import { FeaturesHeader } from './features-header';
import { FeaturesTable } from './features-table';

export const Features = () => {
  const { data, refetch, isError, isLoading } = useSearchFeaturesQuery();
  const { features, count } = data || {};

  return (
    <>
      <title>Features</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <FeaturesHeader />
          <FeaturesTable
            features={features}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
