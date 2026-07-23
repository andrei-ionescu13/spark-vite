import type { ActionsItem } from '@/components/actions-menu';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { useDialog } from '@/hooks/useDialog';
import type { Language } from '@/types/translations';
import { Checkbox, TableCell } from '@mui/material';
import { TrashIcon } from 'lucide-react';
import { LanguageDeleteDialog } from './language-delete-dialog';

interface LanguagesTableRowProps {
  language: Language;
  onSelect: () => void;
  selected: boolean;
}

export const LanguagesTableRow = ({
  language,
  selected,
  onSelect,
}: LanguagesTableRowProps) => {
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  const actionItems: ActionsItem[] = [
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  return (
    <>
      <LanguageDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        language={language}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>{language.name}</TableCell>
        <TableCell>{language.nativeName}</TableCell>
        <TableCell>{language.code}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
