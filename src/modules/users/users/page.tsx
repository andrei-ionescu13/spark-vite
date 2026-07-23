import { Box, Container } from '@mui/material';
import { PageHeader } from '../../../components/page-header';
import { useSearchUsers } from './api';
import { UsersTable } from './users-table';

export const Users = () => {
  const { data, refetch, isError, isLoading } = useSearchUsers();
  const { users, count } = data || {};

  return (
    <>
      <title>Users</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Users" />
          <UsersTable
            users={users}
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
