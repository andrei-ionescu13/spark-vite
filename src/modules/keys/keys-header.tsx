import type { ActionsItem } from '@/components/actions-menu';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { DownloadIcon, KeyRoundIcon } from 'lucide-react';
import { KeyAddDialog } from './key-add-dialog';
import { KeysImportDialog } from './keys-import-dialog';

export const KeysHeader = () => {
  const [addKeyDialogOpen, handleOpenAddKey, handleCloseAddKey] = useDialog();
  const [importKeysDialogOpen, handleOpenImportKeys, handleCloseImportKeys] =
    useDialog(false);

  const actionItems: ActionsItem[] = [
    {
      label: 'Add key',
      icon: KeyRoundIcon,
      onClick: handleOpenAddKey,
    },
    {
      label: 'Import',
      icon: DownloadIcon,
      onClick: handleOpenImportKeys,
    },
  ];

  return (
    <>
      <PageHeader
        title="Keys"
        actions={actionItems}
      />
      {addKeyDialogOpen && (
        <KeyAddDialog
          onClose={handleCloseAddKey}
          open
        />
      )}
      <KeysImportDialog
        open={importKeysDialogOpen}
        onClose={handleCloseImportKeys}
      />
    </>
  );
};
