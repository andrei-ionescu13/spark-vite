import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { useListArticleCategories } from '../../api';
import { useSearchArticles } from './api';
import { ArticlesTable } from './articles-table';

export const Articles = () => {
  const { data: categories } = useListArticleCategories();
  const { data, refetch, isError, isLoading } = useSearchArticles();
  const { articles, count } = data || {};

  return (
    <>
      <title>Articles</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Articles"
            action={{
              href: '/articles/create',
              label: 'Add',
              icon: PlusIcon,
            }}
          />
          <ArticlesTable
            articles={articles}
            count={count}
            isError={isError}
            refetch={refetch}
            isLoading={isLoading}
            categories={categories || []}
          />
        </Container>
      </Box>
    </>
  );
};
