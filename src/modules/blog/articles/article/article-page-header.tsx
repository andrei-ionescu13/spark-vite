import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { MarkdownPreview } from '@/components/markdown-preview';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import type { Article, ArticleStatus } from '@/types/articles';
import { Box, colors, Link, Typography, useTheme } from '@mui/material';
import { CopyIcon, EyeIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDeleteArticle } from '../../api';
import { useDuplicateArticle } from '../articles/api';
import { ArticleDuplicateDialog } from '../components/article-duplicate-dialog';

interface ArticlePageHeaderProps {
  article: Article;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Article duplicated
    </Typography>
    <Link
      color="textPrimary"
      href={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

export const ArticlePageHeader = ({ article }: ArticlePageHeaderProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [
    openDuplicateDialog,
    handleOpenDuplicateDialog,
    handleCloseDuplicateDialog,
  ] = useDialog();
  const [openPreviewDialog, handleOpenPreviewDialog, handleClosePreviewDialog] =
    useDialog();
  const deleteArticle = useDeleteArticle();
  const duplicateArticle = useDuplicateArticle(article?._id || '');

  const actionItems: ActionsItem[] = [
    {
      label: 'Preview',
      icon: EyeIcon,
      onClick: handleOpenPreviewDialog,
    },
    {
      label: 'Duplicate',
      icon: CopyIcon,
      onClick: handleOpenDuplicateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const mappedColors: Record<ArticleStatus, string> = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

  if (!article) return null;

  const handleDeleteArticle = () => {
    deleteArticle.mutate(article._id, {
      onSuccess: () => {
        navigate('/articles');
      },
    });
  };

  return (
    <>
      <PageHeader
        actions={actionItems}
        backHref="/articles"
        backLabel="Articles"
        title={article.title}
      >
        <Label color={mappedColors[article.status]}>{article.status}</Label>
      </PageHeader>
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title={`Delete article ${article._id}`}
        content="Are you sure you want to permanently delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isPending}
      />
      <ArticleDuplicateDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        articleId={article._id}
      />
      <MarkdownPreview
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        markdown={article.markdown}
        title={article.title}
        cover={article.cover.url}
      />
    </>
  );
};
