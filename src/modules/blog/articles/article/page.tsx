import { Box, Container, Grid } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useListArticleCategories } from '../../api';
import { useGetArticle } from './api';
import { ArticleGeneral } from './article-general';
import { ArticleGeneralForm } from './article-general-form';
import { ArticleMeta } from './article-meta';
import { ArticleMetaForm } from './article-meta-form';
import { ArticlePageHeader } from './article-page-header';
import { ArticleStatusCategory } from './article-status-category';
import { ArticleTags } from './article-tags';

type DisplayedForm = 'details' | 'meta' | null;

export const Article = () => {
  const params = useParams<{ id: string }>();
  const { data: article } = useGetArticle(params.id);
  const { data: categories } = useListArticleCategories();
  const [displayedForm, setDisplayedForm] = useState<DisplayedForm>();
  const isEditDisabled = article?.status === 'archived';

  const handleDisplayForm = (displayedForm: DisplayedForm) => {
    window.scrollTo(0, 0);
    setDisplayedForm(displayedForm);
  };

  const handleHideForm = () => {
    window.scrollTo(0, 0);
    setDisplayedForm(null);
  };

  if (!article || !categories) return null;

  return (
    <>
      <title>Article</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <ArticlePageHeader article={article} />
          {article && displayedForm === 'details' && (
            <ArticleGeneralForm
              article={article}
              onClose={handleHideForm}
            />
          )}
          {article && displayedForm === 'meta' && (
            <ArticleMetaForm
              article={article}
              onClose={handleHideForm}
            />
          )}
          {!!article && !displayedForm && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  md: 8,
                  xs: 12,
                }}
              >
                <ArticleGeneral
                  article={article}
                  isEditDisabled={isEditDisabled}
                  onEdit={() => {
                    handleDisplayForm('details');
                  }}
                />
              </Grid>
              <Grid
                container
                size={{
                  md: 4,
                  xs: 12,
                }}
                spacing={2}
                sx={{ height: 'fit-content' }}
              >
                <Grid size={12}>
                  <ArticleStatusCategory
                    article={article}
                    categories={categories}
                    isEditDisabled={isEditDisabled}
                  />
                </Grid>
                <Grid size={12}>
                  <ArticleTags
                    article={article}
                    isEditDisabled={isEditDisabled}
                  />
                </Grid>
                <Grid size={12}>
                  <ArticleMeta
                    article={article}
                    isEditDisabled={isEditDisabled}
                    onEdit={() => {
                      handleDisplayForm('meta');
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};
