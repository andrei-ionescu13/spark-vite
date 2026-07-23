import { Box, Container } from '@mui/material';
import { useSearchPlatformsQuery } from './api';
import { PlatformsHeader } from './platforms-header';
import { PlatformsTable } from './platforms-table';

export const Platforms = () => {
  const { data, refetch, isError, isLoading } = useSearchPlatformsQuery();
  const { platforms, count } = data || {};

  return (
    <>
      <title>Platforms</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PlatformsHeader />
          <PlatformsTable
            platforms={platforms}
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
