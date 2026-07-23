import { Box, Container } from '@mui/material';
import { useSearchArticleCategories } from './api';
import { CategoriesHeader } from './categories-header';
import { CategoriesTable } from './categories-table';

export const ArticleCategories = () => {
  const { data, refetch, isError, isLoading } = useSearchArticleCategories();
  const { categories, count } = data || {};

  return (
    <>
      <title>Article categories</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <CategoriesHeader />
          <CategoriesTable
            categories={categories}
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
