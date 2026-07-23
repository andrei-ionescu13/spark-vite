import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { DeveloperCreateDialog } from './developer-create-dialog';

export const DevelopersHeader = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Developers"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: PlusIcon,
        }}
      />
      {createDialogOpen && (
        <DeveloperCreateDialog
          open
          onClose={handleCloseCreateDialog}
        />
      )}
    </>
  );
};
