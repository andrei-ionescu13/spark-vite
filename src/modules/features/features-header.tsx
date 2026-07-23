import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { FeatureCreateDialog } from './feature-create-dialog';

export const FeaturesHeader = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Feature"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: PlusIcon,
        }}
      />
      {createDialogOpen && (
        <FeatureCreateDialog
          open
          onClose={handleCloseCreateDialog}
        />
      )}
    </>
  );
};
