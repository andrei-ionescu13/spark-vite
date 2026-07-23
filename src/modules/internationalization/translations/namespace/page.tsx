import { useListNamespaceLanguagesQuery } from '@/api';
import { Box, Container } from '@mui/material';
import { useParams } from 'react-router';
import { TranslationsTable } from '../translations-table';
import { useSearchNamespaceTranslations } from './api';
import { NamespaceHeader } from './namespace-header';

export const Namespace = () => {
  const { id } = useParams<{ id: string }>();
  const listLanguagesQuery = useListNamespaceLanguagesQuery();
  const searchNamespaceTranslationsQuery = useSearchNamespaceTranslations(id);

  const isLoading =
    searchNamespaceTranslationsQuery.isLoading || listLanguagesQuery.isLoading;

  const isError =
    searchNamespaceTranslationsQuery.isError || listLanguagesQuery.isError;

  return (
    <>
      <title>Translations</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <NamespaceHeader
            namespace={searchNamespaceTranslationsQuery.data}
            languages={listLanguagesQuery.data}
            isLoading={isLoading}
          />
          <TranslationsTable
            languages={listLanguagesQuery.data}
            namespace={searchNamespaceTranslationsQuery.data}
            count={searchNamespaceTranslationsQuery?.data?.count}
            isLoading={isLoading}
            isError={isError}
            refetch={searchNamespaceTranslationsQuery.refetch}
          />
        </Container>
      </Box>
    </>
  );
};
