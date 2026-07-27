import { AlertDialog } from '@/components/alert-dialog';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { Box, Checkbox, TableCell, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import type { ActionsItem } from '@/components/actions-menu';
import { Link } from '@/components/link';
import { useDialog } from '@/hooks/useDialog';
import type { ArticleCategory } from '@/types/article-category';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useDeleteArticleCategory } from './api';
import { CategoryUpdateDialog } from './category-update-dialog';

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
      to={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

interface CategoriesTableRowProps {
  articleCategory: ArticleCategory;
  onSelect: () => void;
  selected: boolean;
}

export const CategoriesTableRow = ({
  articleCategory,
  selected,
  onSelect,
}: CategoriesTableRowProps) => {
  const queryClient = useQueryClient();
  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();
  const deleteArticle = useDeleteArticleCategory(() =>
    queryClient.invalidateQueries({ queryKey: ['article-categories'] })
  );

  const handleDeleteArticle = () => {
    deleteArticle.mutate(articleCategory._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  return (
    <>
      {updateDialogOpen && (
        <CategoryUpdateDialog
          articleCategory={articleCategory}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete article"
        content="Are you sure you want to delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isPending}
      />
      <DataTableRow
        key={articleCategory._id}
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>{articleCategory.name}</TableCell>
        <TableCell>{articleCategory.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
