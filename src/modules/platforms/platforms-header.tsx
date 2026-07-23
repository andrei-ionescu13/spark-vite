import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { CreatePlatformDialog } from './create-platform-dialog';

export const PlatformsHeader = () => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Platforms"
        action={{
          label: 'Add',
          icon: PlusIcon,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && (
        <CreatePlatformDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
