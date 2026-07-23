import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from 'lucide-react';
import { CurrencyDialog } from './currency-dialog';

export const CurrenciesHeader = () => {
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Currencies"
        action={{
          label: 'Add',
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
      {openDialog && (
        <CurrencyDialog
          open
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};
