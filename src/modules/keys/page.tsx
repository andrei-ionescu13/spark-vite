import type { Key } from '@/types/keys';
import { Box, Container } from '@mui/material';
import { KeysTable } from '../products/components/keys-table';
import { useSearchKeysQuery } from './api';
import { KeysHeader } from './keys-header';

interface GetKeysData {
  keys: Key[];
  count: number;
}

export const Keys = () => {
  const { data, refetch, isError, isLoading } = useSearchKeysQuery();
  const { keys, count } = data || {};

  return (
    <>
      <title>Keys</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <KeysHeader />
          <KeysTable
            keys={keys}
            count={count}
            refetch={refetch}
            isLoading={isLoading}
            isError={isError}
          />
        </Container>
      </Box>
    </>
  );
};
