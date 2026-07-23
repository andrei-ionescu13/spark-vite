import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import type { Language, Namespace } from '@/types/translations';
import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDeleteNamespace } from '../api';
import { CreateTranslationsDialog } from '../namespaces/create-translations-dialog';

interface NamespaceHeaderProps {
  namespace?: Namespace;
  languages?: Language[];
  isLoading: boolean;
}

export const NamespaceHeader = ({
  namespace,
  languages,
  isLoading,
}: NamespaceHeaderProps) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const deleteNamespace = useDeleteNamespace();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const actionItems: ActionsItem[] = [
    {
      label: 'Add',
      icon: PlusIcon,
      onClick: handleOpenAddDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeleteNamespace = () => {
    namespace &&
      deleteNamespace.mutate(namespace._id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ['namespace'] });
          navigate('/translations');
        },
      });
  };

  return (
    <>
      {addDialogOpen && namespace && languages && (
        <CreateTranslationsDialog
          onClose={handleCloseAddDialog}
          open
          namespaceId={namespace._id}
          languages={languages}
        />
      )}
      {deleteDialogOpen && (
        <AlertDialog
          open
          onClose={handleCloseDeleteDialog}
          title={`Delete ${namespace?.name} namespace`}
          content="Are you sure you want to permanently this namespace?"
          onSubmit={handleDeleteNamespace}
          isLoading={deleteNamespace.isPending}
        />
      )}
      <PageHeader
        title={namespace && `${namespace?.name} namespace`}
        actions={actionItems}
        backHref="/namespaces"
        backLabel="Namespaces"
        isLoading={isLoading}
      />
    </>
  );
};
