import { Box, Container } from '@mui/material';
import { useSearchGenresQuery } from './api';
import { GenresHeader } from './genres-header';
import { GenresTable } from './genres-table';

export const Genres = () => {
  const { data, refetch, isError, isLoading } = useSearchGenresQuery();
  const { genres, count } = data || {};

  return (
    <>
      <title>Genres</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <GenresHeader />
          <GenresTable
            genres={genres}
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
