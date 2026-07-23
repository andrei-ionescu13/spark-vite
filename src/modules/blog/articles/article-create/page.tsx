import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { ArticleForm } from './article-form';

export const ArticleCreate = () => {
  return (
    <>
      <title>Article Create</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/articles"
            backLabel="Articles"
            title="Create article"
          />
          <ArticleForm />
        </Container>
      </Box>
    </>
  );
};
