import type { ActionsItem } from '@/components/actions-menu';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { appFetch } from '@/utils/app-fetch';
import { download } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { CreateNamespaceDialog } from './create-namespace-dialog';

export const useUploadTranslations = () =>
  useMutation<{}, Error>({
    mutationFn: () =>
      appFetch({
        url: `/translations/namespaces/upload`,
        config: {
          method: 'POST',
        },
        withAuth: true,
      }),
  });

export const NamespacesHeader = () => {
  const [
    openAddNamespaceDialog,
    handleOpenAddNamespaceDialog,
    handleCloseAddNamespaceDialog,
  ] = useDialog();
  const uploadTranslations = useUploadTranslations();

  const exportTranslations = async () => {
    const blob = await appFetch({
      url: '/translations/namespaces/export',
      responseType: 'blob',
      withAuth: true,
    });
    download(blob, 'translations.zip');
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Add',
      icon: PlusIcon,
      onClick: handleOpenAddNamespaceDialog,
    },
    {
      label: 'Export',
      icon: DownloadIcon,
      onClick: exportTranslations,
    },
    {
      label: 'Upload',
      icon: UploadIcon,
      onClick: () =>
        uploadTranslations.mutate(undefined, {
          onSuccess: () => {
            console.log('done');
            toast.success('Translations uploaded');
          },
        }),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Namespaces"
        actions={actionItems}
      />
      {openAddNamespaceDialog && (
        <CreateNamespaceDialog
          open
          onClose={handleCloseAddNamespaceDialog}
        />
      )}
    </div>
  );
};
