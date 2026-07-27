import { Button } from '@/components/button';
import { InfoList } from '@/components/info-list';
import { InfoListItem } from '@/components/info-list-item';
import { Link } from '@/components/link';
import type { Article } from '@/types/articles';
import { formatDate } from '@/utils/format-date';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from '@mui/material';
import { useState } from 'react';

interface ArticleGeneralProps {
  article: Article;
  isEditDisabled?: boolean;
  onEdit: () => void;
}

export const ArticleGeneral = ({
  article,
  isEditDisabled,
  onEdit,
}: ArticleGeneralProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  if (!article) return null;

  return (
    <Card>
      <CardHeader
        action={
          <Button
            color="secondary"
            disabled={isEditDisabled}
            onClick={onEdit}
            variant="text"
          >
            Edit
          </Button>
        }
        title="General"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={2.5}
        >
          <Grid
            size={{
              md: 6,
              xs: 12,
            }}
          >
            <InfoList>
              <InfoListItem
                content={article._id}
                title="Id"
              />
              <InfoListItem
                content={article.slug}
                title="Slug"
              />
              <InfoListItem
                content={article.description}
                title="Description"
              />
            </InfoList>
          </Grid>
          <Grid
            size={{
              md: 6,
              xs: 12,
            }}
          >
            <InfoList>
              <InfoListItem
                content={formatDate(article.createdAt)}
                title="Created At"
              />
              {article.updatedAt && (
                <InfoListItem
                  content={formatDate(article.updatedAt)}
                  title="Updated At"
                />
              )}
            </InfoList>
          </Grid>
          <Grid size={12}>
            <InfoList>
              <InfoListItem
                content={article.markdown}
                title="Content"
              />
              <InfoListItem title="Cover image">
                <Box>
                  <Link
                    target="_blank"
                    to={article.cover.url}
                  >
                    <img
                      src={article.cover.url}
                      alt={article.title}
                    />
                  </Link>
                </Box>
              </InfoListItem>
            </InfoList>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
