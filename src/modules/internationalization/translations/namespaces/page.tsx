import { useListNamespaceLanguagesQuery } from '@/api';
import { Box, Container } from '@mui/material';
import { useSearchNamespacesQuery } from './api';
import { NamespacesHeader } from './namespaces-header';
import { NamespacesTable } from './namespaces-table';

export const Namespaces = () => {
  const searchNamespacesQuery = useSearchNamespacesQuery();
  const listLanguagesQuery = useListNamespaceLanguagesQuery();
  const isLoading =
    searchNamespacesQuery.isLoading || listLanguagesQuery.isLoading;
  const isError = searchNamespacesQuery.isError || listLanguagesQuery.isError;

  return (
    <>
      <title>Translations</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <NamespacesHeader />
          <NamespacesTable
            languages={listLanguagesQuery.data}
            namespaces={searchNamespacesQuery.data?.namespaces}
            count={searchNamespacesQuery.data?.count}
            isLoading={isLoading}
            isError={isError}
            refetch={searchNamespacesQuery.refetch}
          />
        </Container>
      </Box>
    </>
  );
};
