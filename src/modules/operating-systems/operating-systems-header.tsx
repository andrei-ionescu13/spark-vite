import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { CreateOperatingSystemDialog } from './create-operating-system-dialog';

export const OperatingSystemsHeader = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Operating Systems"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: PlusIcon,
        }}
      />
      {createDialogOpen && (
        <CreateOperatingSystemDialog
          open
          onClose={handleCloseCreateDialog}
        />
      )}
    </>
  );
};
