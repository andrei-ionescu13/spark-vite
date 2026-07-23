import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { CreatePublisherDialog } from './create-publisher-dialog';

export const PublishersHeader = () => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Publishers"
        action={{
          label: 'Add publisher',
          icon: PlusIcon,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && (
        <CreatePublisherDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
