import { Box, Container } from '@mui/material';
import { useSearchArticleTags } from './api';
import { TagsHeader } from './tags-header';
import { TagsTable } from './tags-table';

export const ArticleTags = () => {
  const { data, refetch, isError, isLoading } = useSearchArticleTags();
  const { tags, count } = data || {};

  return (
    <>
      <title>Article categories</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <TagsHeader />
          <TagsTable
            tags={tags}
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
