import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { ArticleCategoryCreateDialog } from './category-create-dialog';

export const CategoriesHeader = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <div>
      <PageHeader
        title="Categories"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: PlusIcon,
        }}
      />
      {createDialogOpen && (
        <ArticleCategoryCreateDialog
          open
          onClose={handleCloseCreateDialog}
        />
      )}
    </div>
  );
};
