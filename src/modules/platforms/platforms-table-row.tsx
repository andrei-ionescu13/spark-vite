import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { Box, Checkbox, TableCell } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';
import { useDeletePlatform } from './api';
import { UpdatePlatformDialog } from './update-platform-dialog';

interface PlatformsTableRowProps {
  platform: any;
  onSelect: () => void;
  selected: boolean;
}

export const PlatformsTableRow = ({
  platform,
  selected,
  onSelect,
}: PlatformsTableRowProps) => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog(false);
  const deletePlatform = useDeletePlatform(() =>
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  );

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeletePlatform = () => {
    deletePlatform.mutate(platform._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  return (
    <>
      {updateDialogOpen && (
        <UpdatePlatformDialog
          open
          onClose={handleCloseUpdateDialog}
          platform={platform}
        />
      )}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete user ${platform._id}`}
        content="Are you sure you want to permanently delete this platform?"
        onSubmit={handleDeletePlatform}
        isLoading={deletePlatform.isPending}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box>
              <img
                src={platform.logo.url}
                alt={platform.name}
                className="max-w-6 w-full"
              />
            </Box>
            {platform.name}
          </Box>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
