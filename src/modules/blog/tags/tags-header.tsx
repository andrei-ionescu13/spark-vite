import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';

export const TagsHeader = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Tags"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: PlusIcon,
        }}
      />
      {/* {createDialogOpen && (
        <ArticleTagCreateDialog open onClose={handleCloseCreateDialog} />
      )} */}
    </>
  );
};
