import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { GenreCreateDialog } from './genre-create-dialog';

export const GenresHeader = () => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Genres"
        action={{
          label: 'Add genre',
          icon: PlusIcon,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && (
        <GenreCreateDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
