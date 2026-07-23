import { Box, Container } from '@mui/material';
import { useSearchOperatingSystemsQuery } from './api';
import { OperatingSystemsHeader } from './operating-systems-header';
import { OperatingSystemsTable } from './operating-systems-table';

export const OperatingSystems = () => {
  const { data, refetch, isError, isLoading } =
    useSearchOperatingSystemsQuery();
  const { operatingSystems, count } = data || {};

  return (
    <>
      <title>Operating Systems</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <OperatingSystemsHeader />
          <OperatingSystemsTable
            operatingSystems={operatingSystems}
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
