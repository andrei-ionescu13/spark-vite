import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { PlusIcon } from 'lucide-react';
import { LanguageDialog } from './language-dialog';

export const LanguagesHeader = () => {
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Languages"
        action={{
          label: 'Add',
          icon: PlusIcon,
          onClick: handleOpenDialog,
        }}
      />
      {openDialog && (
        <LanguageDialog
          open
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};
