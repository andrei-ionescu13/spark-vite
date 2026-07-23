import { Box, Container } from '@mui/material';
import { useSearchDevelopersQuery } from './api';
import { DevelopersHeader } from './developers-header';
import { DevelopersTable } from './developers-table';

export const Developers = () => {
  const { data, refetch, isError, isLoading } = useSearchDevelopersQuery();
  const { developers, count } = data || {};

  return (
    <>
      <title>Developers</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <DevelopersHeader />
          <DevelopersTable
            developers={developers}
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
