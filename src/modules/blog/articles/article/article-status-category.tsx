import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';

import type { ArticleCategory } from '@/types/article-category';
import type { Article } from '@/types/articles';
import { ArticleCategoryForm } from './article-category-form';
import { ArticleStatus } from './article-status';

interface ArticleStatusTagProps {
  article: Article;
  categories: ArticleCategory[];
  isEditDisabled?: boolean;
}

export const ArticleStatusCategory = ({
  article,
  categories,
  isEditDisabled,
}: ArticleStatusTagProps) => {
  if (!article || !categories) return null;

  return (
    <Card>
      <CardHeader title="Status/Category" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={2}
        >
          <ArticleStatus article={article} />
          <ArticleCategoryForm
            categories={categories}
            article={article}
            isEditDisabled={isEditDisabled}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};
