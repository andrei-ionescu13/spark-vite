import { useListNamespaceLanguagesQuery } from '@/api';
import { Box, Container } from '@mui/material';
import { LanguagesHeader } from './languages-header';
import { LanguagesTable } from './languages-table';

export const Languages = () => {
  const { data, refetch, isError, isLoading } =
    useListNamespaceLanguagesQuery();
  const languages = data || [];

  return (
    <>
      <title>Languages</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <LanguagesHeader />
          <LanguagesTable
            languages={languages}
            count={0}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
